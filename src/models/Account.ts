export class Account {
  constructor(
    public readonly address: string,
    public readonly publickey: string,
    public readonly privatekey: string,
    public readonly mnemonic: string = '',
  ) {}
}
