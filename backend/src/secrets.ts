import crypto from 'crypto';

export default class Secrets {
  public static encrypt(msg: string): string {
    const iv = crypto.randomBytes(this.ivWidth);
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(Secrets.key), iv);
    let encrypted = cipher.update(msg);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  public static decrypt(msg: string): string {
    const splitText = msg.split(':');
    const iv = Buffer.from(splitText.shift(), 'hex');
    const encrypted = Buffer.from(splitText.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.key), iv);
    let decrypted = decipher.update(encrypted);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  public static hash(msg: string): string {
    return crypto.createHash('sha512').update(msg).digest('hex');
  }

  public static compareHash(left: string, right: string): boolean {
    return left === right;
  }

  private static algorithm = 'aes-256-cbc';

  // 256 bits
  private static key: Buffer = crypto.randomBytes(32);

  private static ivWidth = 16;
}
