import Secrets from './secrets';
import { IToken } from './auth';

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
