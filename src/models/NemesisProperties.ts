type NemesisProp = {
  networkIdentifier: number
  nemesisGenerationHashSeed: string
  nemesisSignerPrivateKey: string
}

type CppProp = { cppFileHeader: string }

type OutputProp = {
  cppFile: string
  binDirectory: string
}

export type NamepsacesProp = {
  name: string
  duration: number
  children: NamepsacesProp[]
  mosaic?: MosaicsProperties
}

type MosaicsProperties = {
  duration: number
  divisibility: number
  supply: string
  isTransferable: boolean
  isSupplyMutable: boolean
  isRestrictable: boolean
  isRevokable: boolean
  distribution: { address: string; supply: bigint }[]
}

type TransactionsProp = { transactionsDirectory: string }

export class NemesisProperties {
  public nemesis: NemesisProp
  public cpp: CppProp
  public output: OutputProp
  public namespaces: NamepsacesProp[]
  public transactions: TransactionsProp

  constructor() {
    this.nemesis = {
      networkIdentifier: 0,
      nemesisGenerationHashSeed: '',
      nemesisSignerPrivateKey: '',
    }
    this.cpp = { cppFileHeader: '' }
    this.output = { cppFile: '', binDirectory: '' }
    this.namespaces = []
    this.transactions = { transactionsDirectory: '' }
  }
}
