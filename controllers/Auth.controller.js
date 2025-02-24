import prisma from "../db/index.js";
import vine, { errors } from "@vinejs/vine";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../validations/Auth.validation.js";
import { sendEmail } from "../config/nodemailer.js";
import logger from "../utils/logger.js";
import { emailQueue, emailQueueName } from "../jobs/EmailQueueJob.js";

class AuthController {
  static async register(req, res) {
    const body = req.body;
    // console.log(body);

    try {
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);

      const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (existingUser) {
        return res.status(400).json({
          errors: {
            email: "email already taken, please use different email",
          },
        });
      }

      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);

      const newUser = await prisma.user.create({
        data: payload,
      });

      return res.status(200).json({ message: "user created successfully" });
    } catch (error) {
      console.log(error.message);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res
          .status(500)
          .json({ message: "INTERNAL SERVER ERROR,PLEASE TRY AGAIN" });
      }
    }
  }

  static async login(req, res) {
    const body = req.body;

    try {
      const validator = vine.compile(loginSchema);
      const payload = await validator.validate(body);

      const user = await prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (!user) {
        return res.status(400).json({
          errors: {
            email: "email does not exists",
          },
        });
      }

      const comparePassowrd = await bcrypt.compare(
        payload.password,
        user.password
      );

      if (!comparePassowrd) {
        return res.status(400).json({
          errors: {
            password: "please give correct password",
          },
        });
      }

      const token = jwt.sign(
        { email: user.email, id: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: "10d",
        }
      );
      //   res.cookies("token", token);
      return res.status(200).json({
        message: "Logged In",
        token: `Bearer ${token}`,
      });
    } catch (error) {
      console.log(error.message);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res
          .status(500)
          .json({ message: "INTERNAL SERVER ERROR,PLEASE TRY AGAIN" });
      }
    }
  }

  static async sendEmailToUser(req, res) {
    const { email } = req.query;
    // console.log(email);

    try {
      // console.log(email);
      const payload = [
        {
          toEmail: email,
          subject: "Welcome to our platform",
          body: "<h1> Thank you for joining our platform</h1>",
        },
        {
          toEmail: email,
          subject: "This is second email",
          body: "<h1> Thank you for recieving 2nd email</h1>",
        },
        {
          toEmail: email,
          subject: "This is third email",
          body: "<h1> Thank you for recieving 3rd email</h1>",
        },
      ];

      // const mail = await sendEmail(payload.toEmail, payload.subject, payload.body);
      // console.log(mail);
      await emailQueue.add(emailQueueName, payload);
      // const completed = await emailQueue.getJobs(["completed"], 0, 100, true);
      // console.log(completed);

      // returns the oldest 100 jobs

      return res.status(200).json({ message: "job added successfully" });
    } catch (error) {
      logger.error(error?.message);
      console.log(error.message);
      return res
        .status(500)
        .json({ message: "INTERNAL SERVER ERROR,PLEASE TRY AGAIN" });
    }
  }
}

export default AuthController;
