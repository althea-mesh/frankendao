import { Button, Field, Info, SidePanel, Text, TextInput } from '@aragon/ui'
import { utils } from 'ethers'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import althea from '../althea'

const blocksPerMonth = 30 * 24 * 60 * 6

type Props = {
  handleClose: () => void
  opened: boolean
}

const SubscriptionFee: FunctionComponent<Props> = ({
  handleClose,
  opened,
}: Props) => {
  const [t] = useTranslation()

  const [fee, setFee] = useState('')
  const [currentFee, setCurrentFee] = useState(0)

  const init = async () => {
    let initialFee = await althea.perBlockFee()
    initialFee = initialFee.mul(blocksPerMonth)
    setCurrentFee(parseFloat(utils.formatEther(initialFee)))
  }

  useEffect(() => {
    init()
    return
  }, [])

  const submit = () => {
    althea.setPerBlockFee(utils.parseEther(fee.toString()).div(blocksPerMonth))
  }

  const changeFee = (e: React.FormEvent<HTMLInputElement>) =>
    setFee(e.currentTarget.value)

  return (
    <SidePanel
      title={t('updateSubscriptionFee')}
      opened={opened}
      onClose={handleClose}
    >
      <Info.Action title={t('nodesPay')}>
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

      <Field label={t('newSubscriptionFee')}>
        <TextInput type="text" name="fee" onChange={changeFee} value={fee} />
        <Text style={{ color: '#ccc', fontSize: '12px', marginLeft: 10 }}>
          ETH
        </Text>
      </Field>

      <Button
        mode="strong"
        wide={true}
        style={{ marginTop: 20 }}
        onClick={submit}
      >
        {t('updateSubscriptionFee')}
      </Button>
    </SidePanel>
  )
}

export default SubscriptionFee
