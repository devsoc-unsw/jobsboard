import { Request, Response } from "express";
import EmailTemplates from "email-templates";
import nodemailer from "nodemailer";
import Helpers from "./helpers";
import Logger from "./logging";

export default class MailFunctions {
  public static async SendTestEmail(req: Request, res: Response) {
    try {
      const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "",
          pass: ""
        }
      });
      transport.verify((error, success) => {
        if (error) {
          Logger.Error(`${error}`);
        } else {
          Logger.Info("Server is ready to take our messages");
          transport.sendMail({
            from: "",
            to: "",
            subject: "Test Subject",
            text: "Plaintext version of the email",
            html: "<p>HTML version of the email</p>"
          }, () => Logger.Info("Email has been sent!"));
        }
      });
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(400);
    }
  }
}
