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
        "",
        "Scheduled emailing",
        `Message contents.`
      );
      if (mailAddingSuccessful) {
        Logger.Info("Successfully scheduled email request.");
      } else {
        Logger.Error("Failed to schedule email.");
      }
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
    if (process.env.NODE_ENV === "production") {
      mailTransporter.verify((error, _) => {
        if (error) {
          Logger.Error(`Mail verification unsuccessful. Reason: ${error}`);
          throw new Error("Failed to initialise mail service.");
        }
      });
    }
    setInterval(async () => {
      try {
        const mailRequest = await Helpers.doSuccessfullyOrFail(async () => {
          return await getConnection().getRepository(MailRequest)
          .createQueryBuilder()
          .where("MailRequest.sent = :sent", { sent: false })
          .orderBy("MailRequest.createdAt", "ASC")
          .getOne();
        }, `No mail request to send`);
        if (process.env.NODE_ENV === "production") {
          mailTransporter.sendMail({
            from: mailRequest.sender,
            to: mailRequest.recipient,
            subject: mailRequest.subject,
            text: mailRequest.content,
            html: mailRequest.content,
          }, () => Logger.Info(`Successfully sent EMAIL=${mailRequest.id}`));
        } else {
          Logger.Info(`NODE_ENV is not production (currently ${process.env.NODE_ENV}), therefore no email will be sent. Here is the email that would have been sent:
                      ${JSON.stringify(mailRequest)}`);
        }
        await getConnection().createQueryBuilder()
        .update(MailRequest)
        .set({ sent: true })
        .where("id = :id", { id: mailRequest.id })
        .execute();
      } catch (error) {
        // Couldn't find mail to send.
        return;
      }
    }, mailSendingIntervalRate);
  }

  public static async AddMailToQueue(recipient: string, subject: string, content: string): Promise<boolean> {
    try {
      // check parameters
      try {
        Helpers.requireParameters(process.env.MAIL_USERNAME);
      } catch (error) {
        Logger.Error(`[DEBUG] Mail username parameter checking failed`);
      }
      try {
        Helpers.requireParameters(recipient);
      } catch (error) {
        Logger.Error(`[DEBUG] Recipient parameter checking failed`);
      }
      try {
        Helpers.requireParameters(subject);
      } catch (error) {
        Logger.Error(`[DEBUG] Subject parameter checking failed`);
      }
      try {
        Helpers.requireParameters(content);
      } catch (error) {
        Logger.Error(`[DEBUG] Content parameter checking failed`);
      }
      const conn: Connection = getConnection();
      const newMailRequest: MailRequest = new MailRequest();
      newMailRequest.sender = process.env.MAIL_USERNAME;
      newMailRequest.recipient = recipient;
      newMailRequest.subject = subject;
      newMailRequest.content = content;

      await conn.manager.save(newMailRequest); 
      Logger.Info("[DEBUG] Saved user mail request");

      // send a copy of this email to the admin
      const newMailRequestForAdmin: MailRequest = new MailRequest();
      newMailRequestForAdmin.sender = process.env.MAIL_USERNAME;
      newMailRequestForAdmin.recipient = process.env.MAIL_USERNAME;
      newMailRequestForAdmin.subject = subject;
      newMailRequestForAdmin.content = `The following was sent to "${recipient}" with subject "${subject}":

        CONTENT BEGINS HERE
      ------------------------
        ${content}
      `;

      await conn.manager.save(newMailRequestForAdmin);
      Logger.Info("[DEBUG] Saved admin mail request");

      return true;
    } catch (error) {
      Logger.Error(`AddMailToQueue FAILED with error ${error}`);
      return false;
    }
  }
}
