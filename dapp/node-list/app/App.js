import React from "react";
import PropTypes from "prop-types";
import { AragonApp, Button, Text } from "@aragon/ui";
import styled from "styled-components";
import { Grid } from "react-flexbox-grid";
import { translate } from "react-i18next";
import web3Utils from "web3-utils";
import { Address6 } from "ip-address";
import BigInteger from "jsbn";
import Fuse from "fuse.js";

import NewNode from "./components/NewNode";
import GenerateReport from "./components/GenerateReport";
import SubscriptionFee from "./components/SubscriptionFee";

import Nav from "./components/Nav";
import { Contract } from "./Contract";
const ethers = window.ethers;

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

const AppContainer = styled(AragonApp)`
  display: flex;
  align-content: flex-start;
  flex-direction: column;
  margin-top: 80px;
`;

class App extends React.Component {
  setSearch = event => {
    let nodes = this.state.nodes;
    let filteredNodes = nodes;

    if (event.target.value) {
      let options = {
        threshold: 0.1,
        keys: ["ipAddress", "ethAddress", "nickname"]
      };
      let fuse = new Fuse(nodes, options);

      filteredNodes = fuse.search(event.target.value);
    }

    this.setState({ filteredNodes });
  };

  displaySidebar = key => {
    this.setState({
      [key]: true
    });
  };

  state = {
    newNode: false,
    subscriptionFee: false,
    generateReport: false,
    page: null,
    nodes: [],
    setSearch: this.setSearch,
    displaySidebar: this.displaySidebar
  };

  getNodes = async () => {
    // Connect to the network
    let provider = new ethers.providers.JsonRpcProvider();

    // The address from the above deployment example
    let contractAddress = "0x15978B376de73fE5D819f4BDE03a10A682128458";

    // We connect to the Contract using a Provider, so we will only
    // have read-only access to the Contract
    let althea = new ethers.Contract(contractAddress, abi, provider);

    let count = await althea.getCountOfSubscribers();

    let nodes = [];
    for (let i = 0; i < count; i++) {
      let ipAddress = await althea.subnetSubscribers(i);
      let user = await althea.userMapping(ipAddress);
      console.log(user);
      let ethAddress = user.ethAddr;
      let nickname = user.nick;
      let bill = (await althea.billMapping(ethAddress)).balance;
      let node = { nickname, bill, ethAddress, ipAddress };
      nodes.push(node);
    }

    nodes = nodes.map((node, i) => {
      let { nickname, ipAddress } = node;
      console.log(nickname);
      nickname = web3Utils.toUtf8(nickname);
      ipAddress =
        Address6.fromBigInteger(
          new BigInteger(ipAddress.substr(2), 16)
        ).correctForm() + "/64";
      return { ...node, nickname, ipAddress };
    });

    this.setState({ nodes });
    this.setState({ filteredNodes: nodes });
  };

  async componentDidMount() {
    await this.getNodes();
  }

  render() {
    const Page = this.state.page;
    const { app, nodes, appAddress, daoAddress } = this.props;
    const { newNode, generateReport, subscriptionFee } = this.state;

    return (
      <Contract.Provider value={this.state}>
        <div className="yoyoyo">
          <AppContainer publicUrl={window.location.href}>
            <Grid fluid>
              <NewNode
                opened={newNode}
                daoAddress={daoAddress}
                nodes={nodes}
                handleClose={() => this.setState({ newNode: false })}
              />
              <GenerateReport
                opened={generateReport}
                handleClose={() => this.setState({ generateReport: false })}
              />
              <SubscriptionFee
                opened={subscriptionFee}
                handleClose={() => this.setState({ subscriptionFee: false })}
              />

              <div
                style={{ background: "white", borderBottom: "1px solid #ddd" }}
              >
                <Text size="xxlarge">Althea</Text>
                <Button
                  mode="strong"
                  style={{ float: "right", padding: "10px 40px" }}
                  onClick={() => {
                    this.setState({ newNode: true });
                  }}
                >
                  New Node
                </Button>
                <Nav setPage={page => this.setState({ page })} />
              </div>
              {this.state.page && (
                <Page
                  app={app}
                  nodes={nodes}
                  appAddress={appAddress}
                  daoAddress={daoAddress}
                />
              )}
            </Grid>
          </AppContainer>
        </div>
      </Contract.Provider>
    );
  }
}

App.propTypes = {
  app: PropTypes.object,
  nodes: PropTypes.array,
  appAddress: PropTypes.string,
  daoAddress: PropTypes.string,
  t: PropTypes.func
};

export default translate()(App);
