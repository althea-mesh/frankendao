import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Button, DropDown, Field, SidePanel, TextInput } from "@aragon/ui";
import { Row, Col } from "react-flexbox-grid";

const GenerateReport = ({ handleClose, opened }) => {
  let [t] = useTranslation();

  let [name, setName] = useState("");
  let [type, setType] = useState(0);
  let [format, setFormat] = useState(0);
  let [start, setStart] = useState("");
  let [end, setEnd] = useState("");

  let [address, setAddress] = useState("");
  let [nickname, setNickname] = useState("");
  let [amount, setAmount] = useState("");
  let [date, setDate] = useState("");
  let [reference, setReference] = useState("");

  const types = ["Finance"];
  const formats = ["CSV"];

  return (
    <SidePanel title="Generate Report" opened={opened} onClose={handleClose}>
      <Field label={t("reportName")}>
        <TextInput
          wide
          type="text"
          name="name"
          onChange={e => setName(e.target.value)}
          value={name}
        />
      </Field>
      <Row>
        <Col xs={6}>
          <Field label={t("reportType")}>
            <DropDown items={types} active={type} onChange={i => setType(i)} />
          </Field>
        </Col>
        <Col>
          <Field label={t("fileType")}>
            <DropDown
              items={formats}
              active={format}
              onChange={i => setFormat(i)}
            />
          </Field>
        </Col>
      </Row>
      <hr style={{ border: "1px solid #eee" }} />
      <Row>
        <Col xs={6}>
          <Field label={t("periodStart")}>
            <TextInput
              wide
              type="text"
              name="start"
              onChange={e => setStart(e.target.value)}
              value={start}
            />
          </Field>
        </Col>
        <Col>
          <Field label={t("periodEnd")}>
            <TextInput
              wide
              type="text"
              name="end"
              onChange={e => setEnd(e.target.value)}
              value={end}
            />
          </Field>
        </Col>
      </Row>

      <div>
        <input
          id="address"
          type="checkbox"
          value={address}
          onClick={() => setAddress(!address)}
        />
        <label htmlFor="address">Recipient Address</label>
      </div>
      <div>
        <input
          id="nickname"
          type="checkbox"
          value={nickname}
          onClick={() => setNickname(!nickname)}
        />
        <label htmlFor="nickname">Recipient Nickname</label>
      </div>
      <div>
        <input
          id="amount"
          type="checkbox"
          value={amount}
          onClick={() => setAmount(!amount)}
        />
        <label htmlFor="amount">Transaction Amount</label>
      </div>
      <div>
        <input
          id="date"
          type="checkbox"
          value={date}
          onClick={() => setDate(!date)}
        />
        <label htmlFor="date">Transaction Date</label>
      </div>
      <div>
        <input
          id="reference"
          type="checkbox"
          value={reference}
          onClick={() => setReference(!reference)}
        />
        <label htmlFor="reference">Transaction Reference</label>
      </div>

      <Button mode="strong" wide style={{ marginTop: 20 }}>
        Generate Report
      </Button>
    </SidePanel>
  );
};

GenerateReport.propTypes = {
  handleClose: PropTypes.func,
  opened: PropTypes.bool,
  t: PropTypes.func
};

export default GenerateReport;
