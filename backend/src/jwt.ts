import Secrets from './secrets';
import { IToken } from './auth';

export default class JWT {
  public static create(raw: object): string {
    // create a string from the object
    const stringObject = JSON.stringify(raw);
    // encrypt
    return Secrets.encrypt(stringObject);
  }

  public static get(msg: string): IToken {
    // decrypt
    const raw = Secrets.decrypt(msg);
    // convert back to JSON object
    return JSON.parse(raw) as IToken;
  }
}
