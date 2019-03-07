import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  ContextMenu,
  ContextMenuItem,
  IconCheck,
  IconCross,
  IconError,
  IconRemove,
  IconTime,
  IconSettings,
  Text
} from "@aragon/ui";
import styled from "styled-components";
import NodeStats from "./NodeStats";
import NodeListControls from "./NodeListControls";
import Blockies from "react-blockies";
import althea, { Context } from "../althea";
import { Address6 } from "ip-address";

const Table = styled.table.attrs({
  className: "table-responsive-sm"
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

const NodeList = () => {
  let [t] = useTranslation();
  let { filteredNodes } = useContext(Context);
  let nodes = filteredNodes;

  let fundsColor = funds => (funds > 0 ? "black" : "red");
  let trunc = (s, n) => `${s.substr(0, n)}...${s.substr(-n)}`;

  let hexIp = ip =>
    "0x" + new Address6(ip).canonicalForm().replace(new RegExp(":", "g"), "");

  let removeNode = async node => {
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
            {nodes.map((node, i) => {
              let { nickname, ethAddress, ipAddress, bill } = node;

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
                          paddingRight: 10
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
                    <Text color={fundsColor(bill.balance)}>
                      {bill.balance} ETH
                    </Text>
                  </td>
                  <td>
                    <Text>
                      {bill.balance > 1 ? (
                        <IconCheck />
                      ) : bill.balance > 0 ? (
                        <IconError />
                      ) : (
                        <IconCross />
                      )}
                      &nbsp;
                      {bill.balance > 1
                        ? "On-track"
                        : bill.balance > 0
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
  t: PropTypes.func
};

export default NodeList;
