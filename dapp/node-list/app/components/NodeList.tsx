import {
  ContextMenu,
  ContextMenuItem,
  IconCheck,
  IconCross,
  IconError,
  IconRemove,
  IconSettings,
  IconTime,
  Text,
} from "@aragon/ui";
import { Address6 } from "ip-address";
import PropTypes from "prop-types";
import React, { FunctionComponent, useContext } from "react";
import Blockies from "react-blockies";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import althea, { Context, utils } from "../althea";
import { Node } from "../types";
import NodeListControls from "./NodeListControls";
import NodeStats from "./NodeStats";

const Table = styled.table.attrs({
  className: "table-responsive-sm",
})`
  background: white;
  width: 100%;

  td,
  th {
    padding: 10px;
  }

  tr {
    border-bottom: 1px solid #dadada;
  }

  tbody {
    border: 1px solid #dadada;
  }

  th {
    font-variant: small-caps;
    text-transform: lowercase;
    background: #f7fbfd;
    color: #aaa;
  }
`;

const Blue = styled.div`
  background: #daeaef;
  height: 25px;
`;

const NodeList: FunctionComponent = () => {
  const [t] = useTranslation();
  const { filteredNodes } = useContext(Context);
  const nodes = filteredNodes;

  const fundsColor = (funds: number) => (funds > 0 ? "black" : "red");
  const trunc = (s: string, n: number) => `${s.substr(0, n)}...${s.substr(-n)}`;

  const hexIp = (ip: string) =>
    "0x" + new Address6(ip).canonicalForm().replace(new RegExp(":", "g"), "");

  const removeNode = async (node: Node) => {
    await althea.deleteMember(hexIp(node.ipAddress), { gasLimit: 500000 });
  };

  return (
    <div>
      <NodeStats />
      <NodeListControls />

      {!nodes || !nodes.length ? (
        <Text>{t("noNodes")}</Text>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>{t("nickname")}</th>
              <th>{t("ethAddress")}</th>
              <th>{t("ipAddress")}</th>
              <th className="text-right">{t("balance")}</th>
              <th>{t("status")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {nodes.map((node: Node, i: number) => {
              let {
                nickname,
                ethAddress,
                ipAddress,
                bill: { balance },
              } = node;

              // balance = utils.formatEther(balance);
              balance = balance.toString();

              return (
                <tr key={i}>
                  <td>
                    <Text>{nickname}</Text>
                  </td>
                  <td>
                    <Blue>
                      <Blockies seed={ethAddress} size={8} scale={3} />
                      <Text
                        style={{
                          display: "block",
                          float: "right",
                          marginLeft: 10,
                          paddingTop: 5,
                          paddingRight: 10,
                        }}
                      >
                        {trunc(ethAddress, 6)}
                      </Text>
                    </Blue>
                  </td>
                  <td>
                    <Text>{ipAddress}</Text>
                  </td>
                  <td className="text-right">
                    <Text color={fundsColor(balance)}>{balance} ETH</Text>
                  </td>
                  <td>
                    <Text>
                      {balance > 1 ? (
                        <IconCheck />
                      ) : balance > 0 ? (
                        <IconError />
                      ) : (
                        <IconCross />
                      )}
                      &nbsp;
                      {balance > 1
                        ? "On-track"
                        : balance > 0
                        ? "Low balance"
                        : "Insufficient funds"}
                    </Text>
                  </td>
                  <td>
                    <ContextMenu>
                      <ContextMenuItem onClick={() => removeNode(node)}>
                        <IconRemove /> Remove Node
                      </ContextMenuItem>
                      <ContextMenuItem>
                        <IconTime />
                        &nbsp; Send Billing Reminder
                      </ContextMenuItem>
                      <ContextMenuItem>
                        <IconSettings /> View Node Details
                      </ContextMenuItem>
                    </ContextMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};

NodeList.propTypes = {
  t: PropTypes.func,
};

export default NodeList;
