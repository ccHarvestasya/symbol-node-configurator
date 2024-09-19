import { Account } from './Account'

type NemesisProp = {
  networkIdentifier: number
  nemesisGenerationHashSeed: string
  nemesisSignerAccount: Account
}

type CppProp = { cppFileHeader: string }

type OutputProp = {
  cppFile: string
  binDirectory: string
}

export type NamespacesProp = {
  name: string
  duration: number
  children: NamespacesProp[]
}

export type MosaicsProp = {
  duration: number
  namespace: string
  divisibility: string
  supply: string
  supplyUnits: string
  isTransferable: boolean
  isSupplyMutable: boolean
  isRestrictable: boolean
  isRevokable: boolean
  distribution: { supply: bigint; account: Account }[]
}

type TransactionsProp = { transactionsDirectory: string }

export class NemesisProperties {
  public nemesis: NemesisProp
  public cpp: CppProp
  public output: OutputProp
  public namespaces: NamespacesProp[]
  public mosaics: MosaicsProp[]
  public transactions: TransactionsProp

  constructor() {
    this.nemesis = {
      networkIdentifier: 0,
      nemesisGenerationHashSeed: '',
      nemesisSignerAccount: new Account('', '', ''),
    }
    this.cpp = { cppFileHeader: '' }
    this.output = { cppFile: '', binDirectory: '' }
    this.namespaces = []
    this.mosaics = []
    this.transactions = { transactionsDirectory: '' }
  }
}
