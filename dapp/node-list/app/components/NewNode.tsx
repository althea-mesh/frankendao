import { Button, Field, SidePanel, Text, TextInput } from '@aragon/ui'
import { Address6 } from 'ip-address'
import QrCode from 'qrcode.react'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import QrReader from 'react-qr-reader'
import styled from 'styled-components'
import althea, { utils } from '../althea'

const FatTextInput = styled(TextInput)`
  padding: 8px;
`

type Props = {
  daoAddress: string
  handleClose: () => void
  opened: boolean,
}

const NewNode: FunctionComponent<Props> = ({
  daoAddress,
  handleClose,
  opened,
}) => {
  const [t] = useTranslation()

  const [nickname, setNickname] = useState('')
  const [ethAddress, setEthAddress] = useState('')
  const [ipAddress, setIpAddress] = useState('')
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    const subnet48 = '2001:dead:beef:'
    const bytes = new Uint16Array(1)
    crypto.getRandomValues(bytes)

    const block64 = Array.from(bytes)[0].toString(16)
    const ipAddress = subnet48 + block64 + '::/64'

    setIpAddress(ipAddress)
  }, [])

  const hex = (s: string) =>
    utils.hexDataSlice(utils.formatBytes32String(s), 0, 16)

  const hexIp = (ip: string) =>
    '0x' + new Address6(ip).canonicalForm().replace(new RegExp(':', 'g'), '')

  const handleScan = (data: string | null) => {
    if (data) {
      setEthAddress(data.replace('ethereum:', ''))
      setScanning(false)
    }
  }

  const submit = () => {
    althea.addMember(ethAddress, hexIp(ipAddress), hex(nickname), {
      gasLimit: 500000,
    })
  }

  const changeNickname = (e: React.FormEvent<HTMLInputElement>) =>
    setNickname(e.currentTarget.value)

  const changeEthAddress = (e: React.FormEvent<HTMLInputElement>) =>
    setEthAddress(e.currentTarget.value)

  return (
    <SidePanel title={t('newNode')} opened={opened} onClose={handleClose}>
      <Field label={t('nodeNickname')}>
        <FatTextInput
          type="text"
          name="nickname"
          onChange={changeNickname}
          value={nickname}
        />
      </Field>

      <Field label={t('customersEthereumAddress')}>
        <Text.Block className="my-2">{t('scanTheQR')}</Text.Block>
        <FatTextInput
          type="text"
          name="fee"
          onChange={changeEthAddress}
          value={ethAddress}
          style={{ marginRight: 15 }}
        />
        <Button mode="outline" onClick={() => setScanning(!scanning)}>
          Scan QR Code
        </Button>
      </Field>
      {scanning && (
        <QrReader
          onError={console.log}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      )}

      <hr style={{ width: '100%', marginTop: 0 }} />

      <div>
        <Text size="large" weight="bold">
          {t('configureSubnet')}
        </Text>
      </div>

      <div className="d-flex flex-wrap mt-2">
        <Text.Block
          className="col p-0"
          dangerouslySetInnerHTML={{
            __html: t('toAssign', { interpolation: { escapeValue: false } }),
          }}
        />
        <div className="col text-right mt-2">
          <QrCode
            value={JSON.stringify({ daoAddress, ipAddress })}
            size={180}
          />
        </div>
      </div>

      <Field label={t('ipAddress')} style={{ marginTop: 10 }}>
        <Text>{ipAddress}</Text>
      </Field>

      <Field label="Subnet Organization Ethereum Address">
        <Text>{daoAddress}</Text>
      </Field>

      <Button mode="strong" wide style={{ marginTop: 20 }} onClick={submit}>
        {t('addNode')}
      </Button>
    </SidePanel>
  )
}

export default NewNode
