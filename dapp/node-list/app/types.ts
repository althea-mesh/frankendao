import { utils } from 'ethers'
import { FunctionComponent } from 'react'

export type Bill = {
  balance: utils.BigNumber
}

export type Node = {
  ipAddress: string
  ethAddress: string
  nickname: string
  bill: Bill
}

export type PageMap = {
  [key: string]: FunctionComponent
}
