import Secrets from './secrets';

export default class JWT {
  public static create(raw: object): string {
    // create a string from the object
    const stringObject = JSON.stringify(raw);
    // encrypt
    return Secrets.encrypt(stringObject);
  }

  public static get(msg: string): any {
    // decrypt
    const raw = Secrets.decrypt(msg);
    // convert back to JSON object
    return JSON.parse(raw);
  }
}
