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
} from '@aragon/ui'
import { utils } from 'ethers'
import { Address6 } from 'ip-address'
import { BigInteger } from 'jsbn'
import React, { FunctionComponent, useContext, useEffect } from 'react'
import Blockies from 'react-blockies'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import althea, { Context } from '../althea'
import { Node } from '../types'
import NodeListControls from './NodeListControls'
import NodeStats from './NodeStats'

const { BigNumber } = utils

const Table = styled.table.attrs({
  className: 'table-responsive',
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
`

const Blue = styled.div`
  background: #daeaef;
  height: 25px;
`

const NodeList: FunctionComponent = () => {
  const [t] = useTranslation()
  const { closeNewNode, setNodes, filteredNodes } = useContext(Context)
  const nodes = filteredNodes

  const fundsColor = (funds: number) => (funds > 0 ? 'black' : 'red')
  const trunc = (s: string, n: number) => `${s.substr(0, n)}...${s.substr(-n)}`

  const hexIp = (ip: string) =>
    '0x' + new Address6(ip).canonicalForm().replace(new RegExp(':', 'g'), '')

  const removeNode = async (e: React.FormEvent<HTMLInputElement>) => {
    const ip = hexIp(e.currentTarget.dataset.ip as string)
    await althea.deleteMember(ip, { gasLimit: 500000 })
  }

  const init = async () => {
    await althea.removeAllListeners('NewMember')
    althea.on(
      'NewMember',
      (ethAddress: string, ipAddress: string, nickname: string) => {
        const intIp: BigInteger = new BigInteger(ipAddress.substr(2), 16)
        ipAddress = Address6.fromBigInteger(intIp).correctForm() + '/64'

        nickname = utils.toUtf8String(nickname).replace(/\u0000/g, '')
        const nodeExists =
          nodes.findIndex((n: Node) => n.ipAddress === ipAddress) > -1

        if (nodeExists) return

        nodes.push({
          ethAddress,
          ipAddress,
          nickname,
          billBalance: 0,
          addrBalance: 0,
        })
        setNodes(nodes)

        closeNewNode()
      },
    )

    await althea.removeAllListeners('MemberRemoved')
    althea.on(
      'MemberRemoved',
      (ethAddress: string, ipAddress: string, nickname: string) => {
        const index = nodes.findIndex((n: Node) => n.ipAddress === ipAddress)
        setNodes(nodes.splice(index, 1))
      },
    )
  }

  useEffect(() => {
    init()
    return
  })

  return (
    <div>
      <NodeStats />
      <NodeListControls />

      {!nodes || !nodes.length ? (
        <Text>{t('noNodes')}</Text>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>{t('nickname')}</th>
              <th>{t('ethAddress')}</th>
              <th>{t('ipAddress')}</th>
              <th className="text-right">{t('addrbalance')}</th>
              <th className="text-right">{t('billbalance')}</th>
              <th>{t('status')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {nodes.map((node: Node, i: number) => {
              const {
                nickname,
                ethAddress,
                ipAddress,
                billBalance,
                addrBalance,
              } = node

              const ethBillBalance = parseFloat(utils.formatEther(billBalance))
              const ethAddrBalance = parseFloat(utils.formatEther(addrBalance))

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
                          display: 'block',
                          float: 'right',
                          marginLeft: 10,
                          paddingTop: 5,
                          paddingRight: 10,
                        }}
                      >
                        {ethAddress}
                      </Text>
                    </Blue>
                  </td>
                  <td>
                    <Text>{ipAddress}</Text>
                  </td>
                  <td className="text-right">
                    <Text>{ethAddrBalance} ETH</Text>
                  </td>
                  <td className="text-right">
                    <Text color={fundsColor(ethBillBalance)}>
                      {ethBillBalance} ETH
                    </Text>
                  </td>
                  <td>
                    <Text>
                      {ethBillBalance > 1 ? (
                        <IconCheck />
                      ) : ethBillBalance > 0 ? (
                        <IconError />
                      ) : (
                        <IconCross />
                      )}
                      &nbsp;
                      {ethBillBalance > 1
                        ? 'On-track'
                        : ethBillBalance > 0
                        ? 'Low balance'
                        : 'Insufficient funds'}
                    </Text>
                  </td>
                  <td>
                    <ContextMenu>
                      <ContextMenuItem onClick={removeNode} data-ip={ipAddress}>
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
              )
            })}
          </tbody>
        </Table>
      )}
    </div>
  )
}

export default NodeList
