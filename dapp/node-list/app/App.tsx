import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { AragonApp, Button, Text } from "@aragon/ui";
import styled from "styled-components";
import { Grid } from "react-flexbox-grid";
import { Address6 } from "ip-address";
import BigInteger from "jsbn";
import Fuse from "fuse.js";

import NewNode from "./components/NewNode";
import GenerateReport from "./components/GenerateReport";
import SubscriptionFee from "./components/SubscriptionFee";

import NodeList from "./components/NodeList";
import Settings from "./components/Settings";

import Nav from "./components/Nav";

import althea, { Context, utils } from "./althea";

const pages = {
  nodeList: NodeList,
  settings: Settings
};

const AppContainer = styled(AragonApp)`
  display: flex;
  align-content: flex-start;
  flex-direction: column;
  margin-top: 80px;
`;

const App = () => {
  let [t] = useTranslation();

  let setSearch = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      let options = {
        threshold: 0.1,
        keys: [
          { name: "ipAddress", weight: 0.1 },
          { name: "ethAddress", weight: 0.1 },
          { name: "nickname", weight: 0.8 }
        ]
      };
      let fuse = new Fuse(nodes, options);

      setFilteredNodes(fuse.search(e.currentTarget.value));
    }
  };

  let [daoAddress, setDaoAddress] = useState("");

  let [nodes, setNodes] = useState([]);
  let [filteredNodes, setFilteredNodes] = useState(null);

  let [newNode, setNewNode] = useState(false);
  let [generateReport, setGenerateReport] = useState(false);
  let [subscriptionFee, setSubscriptionFee] = useState(false);
  let [page, setPage] = useState("nodeList");

  let [blockCount, setBlockCount] = useState(0);

  let init = async () => {
    let count = await althea.getCountOfSubscribers();
    setDaoAddress("12345");

    let nodes = [];
    for (let i = 0; i < count; i++) {
      let ipAddress = await althea.subnetSubscribers(i);
      let user = await althea.userMapping(ipAddress);
      let ethAddress = user.ethAddr;
      let nickname = user.nick;
      let bill = await althea.billMapping(ethAddress);
      let node = { nickname, bill, ethAddress, ipAddress };
      nodes.push(node);
    }

    nodes = nodes.map((node, i) => {
      let { nickname, ipAddress } = node;

      /*eslint-disable-next-line*/
      nickname = utils.toUtf8String(nickname).replace(/\u0000/g, "");

      ipAddress =
        Address6.fromBigInteger(
          new BigInteger(ipAddress.substr(2), 16)
        ).correctForm() + "/64";

      return { ...node, nickname, ipAddress };
    });

    setNodes(nodes);
    setFilteredNodes(nodes);
  };

  useEffect(() => {
    init();
    let poll = setInterval(async () => {
      setBlockCount(await althea.provider.getBlockNumber());
    }, 1000);
    return () => clearInterval(poll);
  }, []);

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

  let store = { setSearch, displaySidebar, filteredNodes, daoAddress };

  let navProps = {
    page,
    setPage,
    pages: Object.keys(pages)
  };

  const Page = pages[page];

  return (
    <Context.Provider value={store}>
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
                onClick={() => setNewNode(true)}
              >
                {t("newNode")}
              </Button>
              <Nav {...navProps} />
              <div>{blockCount}</div>
            </div>
            <Page />
          </Grid>
        </AppContainer>
      </div>
    </Context.Provider>
  );
};

App.propTypes = {
  app: PropTypes.object,
  nodes: PropTypes.array,
  daoAddress: PropTypes.string,
  t: PropTypes.func
};

export default App;
