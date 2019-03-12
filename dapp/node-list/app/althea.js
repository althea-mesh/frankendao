import React from "react";
export const Context = React.createContext();

const abi = [
  {
    constant: true,
    inputs: [{ name: "_ip", type: "bytes16" }],
    name: "getMember",
    outputs: [{ name: "addr", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x376679b0"
  },
  {
    constant: true,
    inputs: [],
    name: "getCountOfSubscribers",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x3b8bd013"
  },
  {
    constant: true,
    inputs: [],
    name: "perBlockFee",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x50e34717"
  },
  {
    constant: true,
    inputs: [],
    name: "wallet",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x521eb273"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "billMapping",
    outputs: [
      { name: "balance", type: "uint256" },
      { name: "perBlock", type: "uint256" },
      { name: "lastUpdated", type: "uint256" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x6bcbf58a"
  },
  {
    constant: false,
    inputs: [],
    name: "payMyBills",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x7f0dc238"
  },
  {
    constant: false,
    inputs: [
      { name: "_ethAddr", type: "address" },
      { name: "_ip", type: "bytes16" },
      { name: "_nick", type: "bytes16" }
    ],
    name: "addMember",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x841ee3f0"
  },
  {
    constant: false,
    inputs: [{ name: "_subscriber", type: "address" }],
    name: "addBill",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
    signature: "0x962e9972"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "bytes16" }],
    name: "userMapping",
    outputs: [
      { name: "ethAddr", type: "address" },
      { name: "nick", type: "bytes16" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0xa41557c6"
  },
  {
    constant: false,
    inputs: [],
    name: "addBill",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
    signature: "0xa4db47ef"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "subnetSubscribers",
    outputs: [{ name: "", type: "bytes16" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0xad8073e3"
  },
  {
    constant: false,
    inputs: [],
    name: "collectBills",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xbc852c40"
  },
  {
    constant: false,
    inputs: [{ name: "_ip", type: "bytes16" }],
    name: "deleteMember",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xdb8c13e3"
  },
  {
    constant: false,
    inputs: [],
    name: "withdrawFromBill",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xef5001fe"
  },
  {
    constant: false,
    inputs: [{ name: "_newFee", type: "uint256" }],
    name: "setPerBlockFee",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xfbeff137"
  },
  {
    inputs: [{ name: "_wallet", type: "address" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "ethAddress", type: "address" },
      { indexed: false, name: "ipAddress", type: "bytes16" },
      { indexed: false, name: "nickname", type: "bytes16" }
    ],
    name: "NewMember",
    type: "event",
    signature:
      "0xe57f5784e78b1736f101d6f3bc8c6872a5f459f075ec7d57f43eff44b5dcfd38"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "ethAddress", type: "address" },
      { indexed: false, name: "ipAddress", type: "bytes16" },
      { indexed: false, name: "nickname", type: "bytes16" }
    ],
    name: "MemberRemoved",
    type: "event",
    signature:
      "0x3fa707f0a1b643f48caf25a10ef749f570de0f6ad6645179168ba127eebb0dd7"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "payer", type: "address" },
      { indexed: false, name: "collector", type: "address" }
    ],
    name: "NewBill",
    type: "event",
    signature:
      "0xed553a58c1e3ebde0827bcbf800a42dd39790c2b44ac7e0cda649b027cebd5f9"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "payer", type: "address" }],
    name: "BillUpdated",
    type: "event",
    signature:
      "0x7d89b3c7d3be1f4bff77e84ddba0d3f104bf9ea3086a1e71fd7d0a84e4a0eaf4"
  }
];

const walletAbi = [
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "owners",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x025e7c27"
  },
  {
    constant: false,
    inputs: [{ name: "owner", type: "address" }],
    name: "removeOwner",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x173825d9"
  },
  {
    constant: false,
    inputs: [{ name: "transactionId", type: "uint256" }],
    name: "revokeConfirmation",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x20ea8d86"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "isOwner",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x2f54bf6e"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }, { name: "", type: "address" }],
    name: "confirmations",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x3411c81c"
  },
  {
    constant: true,
    inputs: [
      { name: "pending", type: "bool" },
      { name: "executed", type: "bool" }
    ],
    name: "getTransactionCount",
    outputs: [{ name: "count", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x54741525"
  },
  {
    constant: false,
    inputs: [{ name: "owner", type: "address" }],
    name: "addOwner",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0x7065cb48"
  },
  {
    constant: true,
    inputs: [{ name: "transactionId", type: "uint256" }],
    name: "isConfirmed",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x784547a7"
  },
  {
    constant: true,
    inputs: [{ name: "transactionId", type: "uint256" }],
    name: "getConfirmationCount",
    outputs: [{ name: "count", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x8b51d13f"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "transactions",
    outputs: [
      { name: "destination", type: "address" },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" },
      { name: "executed", type: "bool" }
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0x9ace38c2"
  },
  {
    constant: true,
    inputs: [],
    name: "getOwners",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0xa0e67e2b"
  },
  {
    constant: true,
    inputs: [
      { name: "from", type: "uint256" },
      { name: "to", type: "uint256" },
      { name: "pending", type: "bool" },
      { name: "executed", type: "bool" }
    ],
    name: "getTransactionIds",
    outputs: [{ name: "_transactionIds", type: "uint256[]" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0xa8abe69a"
  },
  {
    constant: true,
    inputs: [{ name: "transactionId", type: "uint256" }],
    name: "getConfirmations",
    outputs: [{ name: "_confirmations", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0xb5dc40c3"
  },
  {
    constant: true,
    inputs: [],
    name: "transactionCount",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0xb77bf600"
  },
  {
    constant: false,
    inputs: [{ name: "_required", type: "uint256" }],
    name: "changeRequirement",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xba51a6df"
  },
  {
    constant: false,
    inputs: [{ name: "transactionId", type: "uint256" }],
    name: "confirmTransaction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xc01a8c84"
  },
  {
    constant: false,
    inputs: [
      { name: "destination", type: "address" },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" }
    ],
    name: "submitTransaction",
    outputs: [{ name: "transactionId", type: "uint256" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xc6427474"
  },
  {
    constant: true,
    inputs: [],
    name: "MAX_OWNER_COUNT",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0xd74f8edd"
  },
  {
    constant: true,
    inputs: [],
    name: "required",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
    signature: "0xdc8452cd"
  },
  {
    constant: false,
    inputs: [
      { name: "owner", type: "address" },
      { name: "newOwner", type: "address" }
    ],
    name: "replaceOwner",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xe20056e6"
  },
  {
    constant: false,
    inputs: [{ name: "transactionId", type: "uint256" }],
    name: "executeTransaction",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xee22610b"
  },
  {
    inputs: [
      { name: "_owners", type: "address[]" },
      { name: "_required", type: "uint256" }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
    signature: "constructor"
  },
  { payable: true, stateMutability: "payable", type: "fallback" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "sender", type: "address" },
      { indexed: true, name: "transactionId", type: "uint256" }
    ],
    name: "Confirmation",
    type: "event",
    signature:
      "0x4a504a94899432a9846e1aa406dceb1bcfd538bb839071d49d1e5e23f5be30ef"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "sender", type: "address" },
      { indexed: true, name: "transactionId", type: "uint256" }
    ],
    name: "Revocation",
    type: "event",
    signature:
      "0xf6a317157440607f36269043eb55f1287a5a19ba2216afeab88cd46cbcfb88e9"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "transactionId", type: "uint256" }],
    name: "Submission",
    type: "event",
    signature:
      "0xc0ba8fe4b176c1714197d43b9cc6bcf797a4a7461c5fe8d0ef6e184ae7601e51"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "transactionId", type: "uint256" }],
    name: "Execution",
    type: "event",
    signature:
      "0x33e13ecb54c3076d8e8bb8c2881800a4d972b792045ffae98fdf46df365fed75"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "transactionId", type: "uint256" }],
    name: "ExecutionFailure",
    type: "event",
    signature:
      "0x526441bb6c1aba3c9a4a6ca1d6545da9c2333c8c48343ef398eb858d72b79236"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "sender", type: "address" },
      { indexed: false, name: "value", type: "uint256" }
    ],
    name: "Deposit",
    type: "event",
    signature:
      "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "owner", type: "address" }],
    name: "OwnerAddition",
    type: "event",
    signature:
      "0xf39e6e1eb0edcf53c221607b54b00cd28f3196fed0a24994dc308b8f611b682d"
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, name: "owner", type: "address" }],
    name: "OwnerRemoval",
    type: "event",
    signature:
      "0x8001553a916ef2f495d26a907cc54d96ed840d7bda71e73194bf5a9df7a76b90"
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "required", type: "uint256" }],
    name: "RequirementChange",
    type: "event",
    signature:
      "0xa3f1ee9126a074d9326c682f561767f710e927faa811f7a99829d49dc421797a"
  }
];

const ethers = window.ethers;
let provider = new ethers.providers.JsonRpcProvider();
let contractAddress = "0x15978B376de73fE5D819f4BDE03a10A682128458";
let pk = "86DE2CF259BF21A9AA2B8CF78F89ED479681001CA320C5762BB3237DB65445CB";
let wallet = new ethers.Wallet(pk, provider);
window.wallet = wallet;
let althea = new ethers.Contract(contractAddress, abi, wallet);
window.althea = althea;

let walletAddress = "0xB1EbADDf5710d42E5C575AeC68396Cd1a4b04Ce4";
let msig = new ethers.Contract(walletAddress, walletAbi, wallet);
window.msig = msig;

export const { utils } = ethers;
export default althea;
