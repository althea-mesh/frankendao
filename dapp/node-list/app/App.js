import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { AragonApp, Button, Text } from "@aragon/ui";
import styled from "styled-components";
import { Grid } from "react-flexbox-grid";
import web3Utils from "web3-utils";
import { Address6 } from "ip-address";
import BigInteger from "jsbn";
import Fuse from "fuse.js";

import NewNode from "./components/NewNode";
import GenerateReport from "./components/GenerateReport";
import SubscriptionFee from "./components/SubscriptionFee";

import Nav from "./components/Nav";
import althea from "./althea";

const AppContainer = styled(AragonApp)`
  display: flex;
  align-content: flex-start;
  flex-direction: column;
  margin-top: 80px;
`;

const App = () => {
  let [t] = useTranslation();

  let setSearch = event => {
    let filteredNodes = nodes;

    if (event.target.value) {
      let options = {
        threshold: 0.1,
        keys: ["ipAddress", "ethAddress", "nickname"]
      };
      let fuse = new Fuse(nodes, options);

      filteredNodes = fuse.search(event.target.value);
    }

    setFilteredNodes(filteredNodes);
  };

  let [page, setPage] = useState(null);
  let [nodes, setNodes] = useState(null);
  let [filteredNodes, setFilteredNodes] = useState(null);
  let [generateReport, setGenerateReport] = useState(false);
  let [subscriptionFee, setSubscriptionFee] = useState(false);

  let init = async () => {
    let count = await althea.getCountOfSubscribers();

    let nodes = [];
    for (let i = 0; i < count; i++) {
      let ipAddress = await althea.subnetSubscribers(i);
      let user = await althea.userMapping(ipAddress);
      let ethAddress = user.ethAddr;
      let nickname = user.nick;
      let bill = (await althea.billMapping(ethAddress)).balance;
      let node = { nickname, bill, ethAddress, ipAddress };
      nodes.push(node);
    }

    nodes = nodes.map((node, i) => {
      let { nickname, ipAddress } = node;
      nickname = web3Utils.toUtf8(nickname);
      ipAddress =
        Address6.fromBigInteger(
          new BigInteger(ipAddress.substr(2), 16)
        ).correctForm() + "/64";
      return { ...node, nickname, ipAddress };
    });

    setNodes(nodes);
  };

  useEffect(() => init());

  const Page = page;

  let displaySidebar = name => {
    switch (name) {
      case "subscriptionFee":
        setSubscriptionFee(true);
        break;
      case "generateReport":
        setGenerateReport(true);
        break;
      default:
        return;
    }
  };

  return (
    <Context.Provider value={(setSearch, displaySidebar)}>
      <div className="althea-react">
        <AppContainer publicUrl={window.location.href}>
          <Grid fluid>
            <NewNode
              opened={newNode}
              daoAddress={daoAddress}
              nodes={nodes}
              handleClose={() => setNewNode(false)}
            />
            <GenerateReport
              opened={generateReport}
              handleClose={() => setGenerateReport(false)}
            />
            <SubscriptionFee
              opened={subscriptionFee}
              handleClose={() => setSubscriptionFee(false)}
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
              <Nav setPage={setPage} />
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
    </Context.Provider>
  );
};

App.propTypes = {
  app: PropTypes.object,
  nodes: PropTypes.array,
  appAddress: PropTypes.string,
  daoAddress: PropTypes.string,
  t: PropTypes.func
};

export default App;
