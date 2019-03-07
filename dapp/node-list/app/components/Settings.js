import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { DropDown, Text, TextInput } from "@aragon/ui";
import styled from "styled-components";

const locales = ["EN", "ES"];
const Spacer = styled.div`
  margin: 15px 0;
`;

const InputGroup = styled.div`
  display: table;
  border-collapse: collapse;
  ${Text} {
    display: table-cell;
    background: #eee;
    border: 1px solid #e6e6e6;
    color: #666;
    padding: 9px;
    margin: 0;
    border-radius: 3px;
    vertical-align: middle;
  }
  ${TextInput} {
    display: table-cell;
    padding: 10px;
    border-right: none;
    margin-right: -1px;
    margin-bottom: -1px;
  }
`;

const Settings = () => {
  let [t, i18n] = useTranslation();

  let [index, setIndex] = useState(0);
  let [threshold, setThreshold] = useState(0.3);

  let setLocale = i => {
    let locale = locales[i];
    setIndex(i);
    i18n.changeLanguage(locale.toLowerCase());
  };

  return (
    <div style={{ marginTop: 30 }}>
      <Text size="large">{t("language")}</Text>
      <Spacer />
      <Text.Block>{t("defaultLanguage")}</Text.Block>
      <Spacer />

      <DropDown items={locales} active={index} onChange={setLocale} />
      <Spacer />
      <Spacer />
      <Text size="large">Low Balance Threshold</Text>
      <Spacer />
      <Text.Block>{t("lowBalance")}</Text.Block>
      <Spacer />
      <InputGroup>
        <TextInput
          type="text"
          name="threshold"
          onChange={e => setThreshold(e.target.value)}
          value={threshold}
        />
        <Text>ETH</Text>
      </InputGroup>
    </div>
  );
};

Settings.propTypes = {
  i18n: PropTypes.object,
  t: PropTypes.func
};

export default Settings;
