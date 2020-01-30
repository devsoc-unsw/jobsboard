import { Request, Response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import {
  Connection,
  getConnection,
  getRepository,
} from "typeorm";
// import EmailTemplates from "email-templates";

// libraries
import Logger from "./logging";
import Helpers from "./helpers";

// entities
import { MailRequest } from "./entity/mail_request";

export default class MailFunctions {
  public static async SendTestEmail(_: Request, res: Response) {
    try {
      const mailAddingSuccessful = await MailFunctions.AddMailToQueue(
        process.env.MAIL_USERNAME,
        "",
        "Scheduled emailing",
        `Message contents.`
      );
      if (mailAddingSuccessful) {
        Logger.Info("Successfully scheduled email request.");
      } else {
        Logger.Error("Failed to schedule email.");
      } 
      /*
       */
      res.sendStatus(200);
    } catch (error) {
      res.sendStatus(400);
    }
  }

  public static async InitMailQueueScheduler(limitOfEmailsPerDay: number) {
    if (limitOfEmailsPerDay <= 0) {
      throw new Error("Limit of emails per day cannot be less than or equal to zero.");
    }

    // get mail .env
    // requires:
    //      MAIL_SMTP_SERVER
    //      MAIL_SMTP_SERVER_PORT
    //      MAIL_USERNAME
    //      MAIL_PASSWORD
    dotenv.config({ path: './src/mail.env' });

    const mailSendingIntervalRate = (1000 * 60 * 60 * 24) / limitOfEmailsPerDay;
    Logger.Info(`Mail sending rate set to once every ${mailSendingIntervalRate} ms.`);
    const transportOptions = {
      host: process.env.MAIL_SMTP_SERVER,
      port: parseInt(process.env.MAIL_SMTP_SERVER_PORT, 10),
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      requireTLS: true,
    };
    const mailTransporter = nodemailer.createTransport(transportOptions);
    mailTransporter.verify((error, _) => {
      if (error) {
        Logger.Error(`Mail verification unsuccessful. Reason: ${error}`);
        throw new Error("Failed to initialise mail service.");
      }
    });
    setInterval(async () => {
      try {
        const mailRequest = await getRepository(MailRequest).findOneOrFail({
          where: {
            sent: false,
          },
          order: {
            createdAt: "ASC",
          }
        });
        mailTransporter.sendMail({
          from: process.env.MAIL_USERNAME,
          to: mailRequest.recipient,
          subject: mailRequest.subject,
          text: mailRequest.content,
          html: mailRequest.content,
        }, () => Logger.Info(`Successfully sent email id: ${mailRequest.id}.`));
        mailRequest.sent = true;
        await getRepository(MailRequest).save(mailRequest);
      } catch (error) {
        // Couldn't find mail to send.
        // Logger.Error(`Error finding new mail to send: ${error}`);
        return;
      }
    }, mailSendingIntervalRate);
  }

  public static async AddMailToQueue(sender: string, recipient: string, subject: string, content: string): Promise<boolean> {
    try {
      // check parameters
      Helpers.requireParameters(sender);
      Helpers.requireParameters(recipient);
      Helpers.requireParameters(subject);
      Helpers.requireParameters(content);
      const conn: Connection = getConnection();
      const newMailRequest: MailRequest = new MailRequest();
      newMailRequest.sender = sender;
      newMailRequest.recipient = recipient;
      newMailRequest.subject = subject;
      newMailRequest.content = content;
      await conn.manager.save(newMailRequest);
      return true;
    } catch (error) {
      return false;
    }
  }
}
