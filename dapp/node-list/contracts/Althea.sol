pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./MultiSigWallet.sol";

contract Althea {
  using SafeMath for uint;

  event NewMember(
    address indexed ethAddress,
    bytes16 ipAddress,
    bytes16 nickname
  );
  event MemberRemoved(
    address indexed ethAddress,
    bytes16 ipAddress,
    bytes16 nickname
  );

  event NewBill(address payer, address collector);
  event BillUpdated(address payer);

  modifier onlyOwners() {
    address[] memory owners = wallet.getOwners();
    bool owner = false;
    for(uint8 i = 0; i< owners.length; i++) {
      if (msg.sender == owners[i]) {
        owner = true;
        break;
      }
    }
    require(owner, "Not an owner");
    _;
  }

  struct Bill {
    uint balance;
    uint perBlock;
    uint lastUpdated;
  }

  struct User {
    address ethAddr;
    bytes16 nick;
  }

  uint public perBlockFee;
  MultiSigWallet public wallet;
  bytes16[] public subnetSubscribers;
  mapping(bytes16 => User) public userMapping;
  mapping(address => Bill) public billMapping;

  constructor(MultiSigWallet _wallet) public {
    perBlockFee = 10000;
    wallet = _wallet;
  }

  function getMember(bytes16 _ip) external view returns(address addr) {
    addr = userMapping[_ip].ethAddr;
  }

  function setPerBlockFee(uint _newFee) external onlyOwners {
    perBlockFee = _newFee;
  }

  function getCountOfSubscribers() external view returns (uint) {
    return subnetSubscribers.length;
  }

  function addBill() public payable {
    addBill(msg.sender);
  }

  function addBill(address _subscriber) public payable {
    require(msg.value > perBlockFee, "Message value not enough");

    if (billMapping[_subscriber].lastUpdated == 0) {
      billMapping[_subscriber] = Bill(msg.value, perBlockFee, block.number);
      emit NewBill(_subscriber, wallet);
    } else {
      billMapping[_subscriber].balance = billMapping[_subscriber].balance.add(msg.value);
      emit BillUpdated(_subscriber);
    }
  }

  function addMember(address _ethAddr, bytes16 _ip, bytes16 _nick)
    external 
    onlyOwners
  {
    require(userMapping[_ip].ethAddr== address(0), "Member already exists");
    userMapping[_ip] = User(_ethAddr, _nick);
    subnetSubscribers.push(_ip);
    NewMember(_ethAddr, _ip, _nick);
  }

  function collectBills() external {
    uint transferValue = 0;
    for (uint i = 0; i < subnetSubscribers.length; i++) {
      transferValue = transferValue.add(
        processBills(
          userMapping[subnetSubscribers[i]].ethAddr
        )
      );
    }
    require(transferValue != 0, "Transfer value is 0");
    address(wallet).transfer(transferValue);
  }

  function payMyBills() public {
    uint amount = processBills(msg.sender);
    address(wallet).transfer(amount);
  }

  function deleteMember(bytes16 _ip) external onlyOwners {
    MemberRemoved(userMapping[_ip].ethAddr, _ip, userMapping[_ip].nick);
    delete userMapping[_ip];
    for (uint i = 0; i < subnetSubscribers.length; i++) {
      if (_ip == subnetSubscribers[i]) {
        subnetSubscribers[i] = subnetSubscribers[subnetSubscribers.length-1];
        subnetSubscribers.length--;
      }
    }
  }

  function withdrawFromBill() external {
    payMyBills();
    uint amount = billMapping[msg.sender].balance;
    require(amount > 0, "Amount to payout is no more than zero, reverting");
    delete billMapping[msg.sender];
    address(msg.sender).transfer(amount);
    emit BillUpdated(msg.sender);
  }

  function processBills(address _subscriber) internal returns(uint) {
    uint transferValue;
    Bill memory bill = billMapping[_subscriber];
    uint amountOwed = block.number.sub(bill.lastUpdated).mul(bill.perBlock);

    if (amountOwed <= bill.balance) {
      billMapping[_subscriber].balance= bill.balance.sub(amountOwed);
      transferValue = amountOwed;
    } else {
      transferValue = bill.balance;
      billMapping[_subscriber].balance = 0;
    }
    billMapping[_subscriber].lastUpdated = block.number;
    emit BillUpdated(_subscriber);
    return transferValue;
  }

  // leave a space between `function` and `(` or else the parser won't work
  function () external payable {
    addBill();
  }
}
