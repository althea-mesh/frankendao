import { AragonApp, Button, Text } from '@aragon/ui'
import Fuse, { FuseOptions } from 'fuse.js'
import { Address6 } from 'ip-address'
import { BigInteger } from 'jsbn'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Grid } from 'react-flexbox-grid'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Node, PageMap } from './types'

import GenerateReport from './components/GenerateReport'
import NewNode from './components/NewNode'
import SubscriptionFee from './components/SubscriptionFee'

import NodeList from './components/NodeList'
import Settings from './components/Settings'

import Nav from './components/Nav'

import { utils } from 'ethers'
import althea, { Context } from './althea'

const pages: PageMap = {
  nodeList: NodeList,
  settings: Settings,
}

const AppContainer = styled(AragonApp)`
  display: flex;
  align-content: flex-start;
  flex-direction: column;
  margin-top: 80px;
`

const App: FunctionComponent = () => {
  const [t] = useTranslation()

  const setSearch = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value) {
      const options: FuseOptions<Node> = {
        keys: [
          { name: 'ethAddress', weight: 0.1 },
          { name: 'ipAddress', weight: 0.1 },
          { name: 'nickname', weight: 0.8 },
        ],
        threshold: 0.1,
      }
      const fuse = new Fuse(nodes, options)
      const nodeSearch = fuse.search(e.currentTarget.value)

      setFilteredNodes(nodeSearch)
    }
  }

  const [daoAddress, setDaoAddress] = useState('')

  const [nodes, setNodes] = useState<Node[]>([])
  const [filteredNodes, setFilteredNodes] = useState<Node[]>([])

  const [newNode, setNewNode] = useState(false)
  const [generateReport, setGenerateReport] = useState(false)
  const [subscriptionFee, setSubscriptionFee] = useState(false)
  const [page, setPage] = useState('nodeList')

  const init = async () => {
    const count = await althea.getCountOfSubscribers()
    setDaoAddress('12345')

    let initialNodes = []
    for (let i = 0; i < count; i++) {
      const ipAddress = await althea.subnetSubscribers(i)
      const user = await althea.userMapping(ipAddress)
      const ethAddress = user.ethAddr
      const nickname = user.nick
      const billBalance = await althea.getCurrentBalanceOfIpv6(ipAddress)
      const addrBalance = await althea.provider.getBalance(ethAddress)
      const node = { nickname, ethAddress, ipAddress, billBalance, addrBalance }
      initialNodes.push(node)
    }

    initialNodes = initialNodes.map((node, i) => {
      let { nickname, ipAddress } = node

      /*eslint-disable-next-line*/
      nickname = utils.toUtf8String(nickname).replace(/\u0000/g, '')
      const intIp: BigInteger = new BigInteger(ipAddress.substr(2), 16)
      ipAddress = Address6.fromBigInteger(intIp).correctForm() + '/64'

      return { ...node, nickname, ipAddress }
    })

    setNodes(initialNodes)
    setFilteredNodes(initialNodes)
  }

  useEffect(() => {
    init()
    return
  }, [])

  const displaySidebar = (name: string) => {
    switch (name) {
      case 'subscriptionFee':
        setSubscriptionFee(true)
        break
      case 'generateReport':
        setGenerateReport(true)
        break
      default:
        return
    }
  }

  const navProps = {
    page,
    pages: Object.keys(pages),
    setPage,
  }

  const Page = pages[page]

  const openNewNode = () => setNewNode(true)
  const closeNewNode = () => setNewNode(false)
  const closeGenerateReport = () => setGenerateReport(false)
  const closeSubscriptionFee = () => setSubscriptionFee(false)

  const store = {
    closeNewNode,
    setSearch,
    displaySidebar,
    filteredNodes,
    daoAddress,
    setNodes,
  }

  return (
    <Context.Provider value={store}>
      <div className="althea-react">
        <AppContainer publicUrl={window.location.href}>
          <Grid fluid={true}>
            <NewNode
              opened={newNode}
              daoAddress={daoAddress}
              handleClose={closeNewNode}
            />
            <GenerateReport
              opened={generateReport}
              handleClose={closeGenerateReport}
            />
            <SubscriptionFee
              opened={subscriptionFee}
              handleClose={closeSubscriptionFee}
            />

            <div
              style={{ background: 'white', borderBottom: '1px solid #ddd' }}
            >
              <Text size="xxlarge">Althea</Text>
              <Button
                mode="strong"
                style={{ float: 'right', padding: '10px 40px' }}
                onClick={openNewNode}
              >
                {t('newNode')}
              </Button>
              <Nav {...navProps} />
            </div>
            <Page />
          </Grid>
        </AppContainer>
      </div>
    </Context.Provider>
  )
}

export default App
