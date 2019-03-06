import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Button, Field, SidePanel, Text, TextInput } from "@aragon/ui";
import { translate } from "react-i18next";
import { Address6 } from "ip-address";
import styled from "styled-components";
import QrCode from "qrcode.react";
import { Context } from "../althea";

const FatTextInput = styled(TextInput)`
  padding: 8px;
`;

const NewNode = () => {
  let [t] = useTranslation();
  let [nickname, setNickname] = useState("");
  let [ethAddress, setEthAddress] = useState("");

  getIp = () => {
    const subnet48 = "2001:dead:beef:";
    let bytes = new Uint16Array(1);
    crypto.getRandomValues(bytes);

    let block64 = Array.from(bytes)[0].toString(16);
    let ipAddress = subnet48 + block64 + "::/64";

    if (ipExists(ipAddress)) {
      return getIp();
    }

    return ipAddress;
  };

  hexIp = ip =>
    "0x" + new Address6(ip).canonicalForm().replace(new RegExp(":", "g"), "");

  ipExists = ip => {
    if (nodes) {
      return nodes.findIndex(n => n.ipAddress === this.hexIp(ip)) > -1;
    }

    return false;
  };

  messageHandler = ({ data }) => {
    if (data.toString().startsWith("qr:")) {
      this.setState({ ethAddress: data.replace("qr:", ""), scanning: false });
    }
  };

  return (
    <SidePanel title={t("newNode")} opened={opened} onClose={handleClose}>
      <Field label={t("nodeNickname")}>
        <FatTextInput
          type="text"
          name="nickname"
          onChange={e => setNickname(e.target.value)}
          value={nickname}
        />
      </Field>

      <Field label={t("customersEthereumAddress")}>
        <Text.Block className="my-2">{t("scanTheQR")}</Text.Block>
        <FatTextInput
          type="text"
          name="fee"
          onChange={e => setEthAddress(e.target.value)}
          value={ethAddress}
          style={{ marginRight: 15 }}
        />
        <Button mode="outline">Scan QR Code</Button>
      </Field>

      <hr style={{ width: "100%", marginTop: 0 }} />

      <div>
        <Text size="large" weight="bold">
          {t("configureSubnet")}
        </Text>
      </div>

      <div className="d-flex flex-wrap mt-2">
        <Text.Block
          className="col p-0"
          dangerouslySetInnerHTML={{
            __html: t("toAssign", { interpolation: { escapeValue: false } })
          }}
        />
        <div className="col text-right mt-2">
          <QrCode
            value={JSON.stringify({ daoAddress, ipAddress })}
            size={180}
          />
        </div>
      </div>

      <Field label={t("ipAddress")} style={{ marginTop: 10 }}>
        <Text>{ipAddress}</Text>
      </Field>

      <Field label="Subnet Organization Ethereum Address">
        <Text>{daoAddress}</Text>
      </Field>

      <Button mode="strong" wide style={{ marginTop: 20 }}>
        {t("addNode")}
      </Button>
    </SidePanel>
  );
};

NewNode.propTypes = {
  t: PropTypes.func,
  opened: PropTypes.bool,
  daoAddress: PropTypes.string,
  handleClose: PropTypes.func,
  nodes: PropTypes.array
};

export default NewNode;
