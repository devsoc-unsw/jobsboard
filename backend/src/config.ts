import fs from "fs";
import Logger from "./logging";

export default class Config {
  public static getSecret(name: string) {
    try {
      return fs.readFileSync(`/run/secrets/${name}`, 'utf-8');
    } catch (error) {
      if (error.code !== 'ENOENT') {
        Logger.Error(`Error trying to read secret with name "${name}". Error: "${error}"`);
      } else {
        Logger.Error(`Unable to find secret "${name}".`);
      }
    }
  }
};
