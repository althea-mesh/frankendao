import ethers, { Contract, providers, Wallet } from 'ethers'
import React from 'react'
import { abi as altheaAbi } from './contracts/althea'
import { abi as msigAbi } from './contracts/multisig'

export const Context = React.createContext(undefined as any)

const provider = new providers.JsonRpcProvider()
const contractAddress = '0x15978B376de73fE5D819f4BDE03a10A682128458'
const pk = '86DE2CF259BF21A9AA2B8CF78F89ED479681001CA320C5762BB3237DB65445CB'
const wallet = new Wallet(pk, provider)
const althea = new Contract(contractAddress, altheaAbi, wallet)
const walletAddress = '0xB1EbADDf5710d42E5C575AeC68396Cd1a4b04Ce4'
const msig = new Contract(walletAddress, msigAbi, wallet)

export default althea
