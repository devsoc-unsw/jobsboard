import Secrets from './secrets';

// auth token data structures
export interface IToken {
  id: string;
  type: AccountType;
  lastRequestTimestamp: number;
  ipAddress: string;
}

// differentiating between account types
export enum AccountType {
  Admin,
  Student,
  Company,
}

export default class JWT {
  public static create(raw: object): string {
    const stringObject = JSON.stringify(raw);
    return Secrets.encrypt(stringObject);
  }

  public static get(msg: string): IToken {
    const raw = Secrets.decrypt(msg);
    return JSON.parse(raw) as IToken;
  }
}
