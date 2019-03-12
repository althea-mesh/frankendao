import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Button, Field, Info, SidePanel, Text, TextInput } from "@aragon/ui";
import althea, { utils } from "../althea";

const blocksPerMonth = 30 * 24 * 60 * 6;

const SubscriptionFee = ({ handleClose, opened }) => {
  let [t] = useTranslation();

  let [fee, setFee] = useState("");
  let [currentFee, setCurrentFee] = useState(0);

  let init = async () => {
    let fee = await althea.perBlockFee();
    fee = fee.mul(blocksPerMonth);
    setCurrentFee(utils.formatEther(fee));
  };

  useEffect(() => {
    init();
    return;
  }, []);

  let submit = () => {
    althea.setPerBlockFee(utils.parseEther(fee.toString()).div(blocksPerMonth));
  };

  return (
    <SidePanel
      title={t("updateSubscriptionFee")}
      opened={opened}
      onClose={handleClose}
    >
      <Info.Action title={t("nodesPay")}>
        <Text>
          Updating the subscription fee impacts the amount that each node is
          required to pay for being part of your organization.
        </Text>
      </Info.Action>

      <div style={{ marginTop: 15, marginBottom: 15 }}>
        <Text>
          The current subscription fee is &Xi; {currentFee} per month.
        </Text>
      </div>

      <Field label={t("newSubscriptionFee")}>
        <TextInput
          type="text"
          name="fee"
          onChange={e => setFee(e.target.value)}
          value={fee}
        />
        <Text style={{ color: "#ccc", fontSize: "12px", marginLeft: 10 }}>
          ETH
        </Text>
      </Field>

      <Button mode="strong" wide style={{ marginTop: 20 }} onClick={submit}>
        {t("updateSubscriptionFee")}
      </Button>
    </SidePanel>
  );
};

SubscriptionFee.propTypes = {
  handleClose: PropTypes.func,
  opened: PropTypes.bool,
  t: PropTypes.func
};

export default SubscriptionFee;
