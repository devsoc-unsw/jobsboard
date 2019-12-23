import { Request, Response } from "express";
import {
  Connection,
  getConnection,
  getRepository,
} from "typeorm";
import Helpers from "./helpers";
import JWT from "./jwt";
import Logger from "./logging";
import Secrets from "./secrets";
import { AdminAccount } from "./entity/admin_account";

export default class AdminFunctions {
  public static async AuthenticateAdmin(req: Request, res: Response) {
    try {
      const msg = { username: req.body.username, password: req.body.password };
      Helpers.requireParameters(msg.username);
      Helpers.requireParameters(msg.password);
      // check if account exists
      const adminQuery = await getRepository(AdminAccount).findOneOrFail({
        username: msg.username,
      }).catch((error) => { throw new Error(error); });
      try {
        if (!Secrets.compareHash(adminQuery.hash.valueOf(), Secrets.hash(msg.password).valueOf())) {
          throw new Error("Invalid credentials");
        }
        // credentials match, so grant them a token
        res.send({ token: JWT.create({ id: adminQuery.id }) });
      } catch (error) {
        res.sendStatus(401);
      }
    } catch (error) {
      res.sendStatus(400);
    }
  }
}
