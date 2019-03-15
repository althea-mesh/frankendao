import { AragonApp, Button, Text } from '@aragon/ui'
import Fuse, { FuseOptions } from 'fuse.js'
import { Address6 } from 'ip-address'
import { BigInteger } from 'jsbn'
import PropTypes from 'prop-types'
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

import althea, { Context, utils } from './althea'

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

  const [blockCount, setBlockCount] = useState(0)

  const init = async () => {
    const count = await althea.getCountOfSubscribers()
    setDaoAddress('12345')

    let initialNodes = []
    for (let i = 0; i < count; i++) {
      const ipAddress = await althea.subnetSubscribers(i)
      const user = await althea.userMapping(ipAddress)
      const ethAddress = user.ethAddr
      const nickname = user.nick
      const bill = await althea.billMapping(ethAddress)
      const node = { nickname, bill, ethAddress, ipAddress }
      initialNodes.push(node)
    }

    initialNodes = initialNodes.map((node, i) => {
      let { nickname, ipAddress } = node

      /*eslint-disable-next-line*/
      nickname = utils.toUtf8String(nickname).replace(/\u0000/g, '')
      const hexIp: BigInteger = new BigInteger(ipAddress.substr(2), 16)

      ipAddress = Address6.fromBigInteger(hexIp).correctForm() + '/64'

      return { ...node, nickname, ipAddress }
    })

    setNodes(initialNodes)
    setFilteredNodes(initialNodes)
  }

  useEffect(() => {
    init()
    const poll = setInterval(async () => {
      setBlockCount(await althea.provider.getBlockNumber())
    }, 1000)
    return () => clearInterval(poll)
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

  const store = { setSearch, displaySidebar, filteredNodes, daoAddress }

  const navProps = {
    page,
    pages: Object.keys(pages),
    setPage,
  }

  const Page = pages[page]

  return (
    <Context.Provider value={store}>
      <div className="althea-react">
        <AppContainer publicUrl={window.location.href}>
          <Grid fluid>
            <NewNode
              opened={newNode}
              daoAddress={daoAddress}
              handleClose={() => setNewNode(false)}
            />
            <GenerateReport
              opened={generateReport}
              handleClose={() => setGenerateReport(false)}
            />
            <SubscriptionFee
              opened={subscriptionFee}
              handleClose={() => setSubscriptionFee(false)}
            />

            <div
              style={{ background: 'white', borderBottom: '1px solid #ddd' }}
            >
              <Text size="xxlarge">Althea</Text>
              <Button
                mode="strong"
                style={{ float: 'right', padding: '10px 40px' }}
                onClick={() => setNewNode(true)}
              >
                {t('newNode')}
              </Button>
              <Nav {...navProps} />
              <div>{blockCount}</div>
            </div>
            <Page />
          </Grid>
        </AppContainer>
      </div>
    </Context.Provider>
  )
}

App.propTypes = {
  app: PropTypes.object,
  daoAddress: PropTypes.string,
  nodes: PropTypes.array,
  t: PropTypes.func,
}

export default App
