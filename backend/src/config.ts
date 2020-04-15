import fs from "fs";
import Logger from "./logging";

export default Config {
  public static getSecret(name: string) {
    try {
      return fs.readFileSync(`/run/secrets/${name}`, 'utf-8');
    } catch (error) {
      if (err.code !== 'ENOENT') {
        Logging.Error(`Error trying to read secret with name "${name}". Error: "${error}"`);
      } else {
        Logging.Error(`Unable to find secret "${name}".`);
      }
    }
  }
};
