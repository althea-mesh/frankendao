import { Button, DropDown, Field, SidePanel, TextInput } from '@aragon/ui'
import React, { FunctionComponent, useState } from 'react'
import { Col, Row } from 'react-flexbox-grid'
import { useTranslation } from 'react-i18next'

type Props = {
  handleClose: () => void
  opened: boolean,
}

const GenerateReport: FunctionComponent<Props> = ({ handleClose, opened }) => {
  const [t] = useTranslation()

  const [name, setName] = useState('')
  const [type, setType] = useState(0)
  const [format, setFormat] = useState(0)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  const [address, setAddress] = useState(false)
  const [nickname, setNickname] = useState(false)
  const [amount, setAmount] = useState(false)
  const [date, setDate] = useState(false)
  const [reference, setReference] = useState(false)

  const types = ['Finance']
  const formats = ['CSV']

  return (
    <SidePanel title="Generate Report" opened={opened} onClose={handleClose}>
      <Field label={t('reportName')}>
        <TextInput
          wide
          type="text"
          name="name"
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setName(e.currentTarget.value)
          }
          value={name}
        />
      </Field>
      <Row>
        <Col xs={6}>
          <Field label={t('reportType')}>
            <DropDown
              items={types}
              active={type}
              onChange={(i: number) => setType(i)}
            />
          </Field>
        </Col>
        <Col>
          <Field label={t('fileType')}>
            <DropDown
              items={formats}
              active={format}
              onChange={(i: number) => setFormat(i)}
            />
          </Field>
        </Col>
      </Row>
      <hr style={{ border: '1px solid #eee' }} />
      <Row>
        <Col xs={6}>
          <Field label={t('periodStart')}>
            <TextInput
              wide
              type="text"
              name="start"
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setStart(e.currentTarget.value)
              }
              value={start}
            />
          </Field>
        </Col>
        <Col>
          <Field label={t('periodEnd')}>
            <TextInput
              wide
              type="text"
              name="end"
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                setEnd(e.currentTarget.value)
              }
              value={end}
            />
          </Field>
        </Col>
      </Row>

      <div>
        <input
          id="address"
          type="checkbox"
          onClick={() => setAddress(!address)}
        />
        <label htmlFor="address">Recipient Address</label>
      </div>
      <div>
        <input
          id="nickname"
          type="checkbox"
          onClick={() => setNickname(!nickname)}
        />
        <label htmlFor="nickname">Recipient Nickname</label>
      </div>
      <div>
        <input id="amount" type="checkbox" onClick={() => setAmount(!amount)} />
        <label htmlFor="amount">Transaction Amount</label>
      </div>
      <div>
        <input id="date" type="checkbox" onClick={() => setDate(!date)} />
        <label htmlFor="date">Transaction Date</label>
      </div>
      <div>
        <input
          id="reference"
          type="checkbox"
          onClick={() => setReference(!reference)}
        />
        <label htmlFor="reference">Transaction Reference</label>
      </div>

      <Button mode="strong" wide style={{ marginTop: 20 }}>
        Generate Report
      </Button>
    </SidePanel>
  )
}

export default GenerateReport
