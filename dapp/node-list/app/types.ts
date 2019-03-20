import { utils } from 'ethers'
import { FunctionComponent } from 'react'

export type Node = {
  ipAddress: string
  ethAddress: string
  nickname: string
  billBalance: number
  addrBalance: number
}

export type PageMap = {
  [key: string]: FunctionComponent
}
