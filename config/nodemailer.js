import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  host: process.env.HOST,
  port: process.env.PORT,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

export const sendEmail = async (toMail, subject, body) => {
  try {
    // console.log(process.env.FROM, toMail);
    const mailOptions = {
      from: process.env.FROM, // sender address
      to: toMail, // list of receivers
      subject: subject, // Subject line
      html: body,
    };
    const info = await transporter.sendMail(mailOptions);
    return info.response;
  } catch (error) {
    console.log(error.message);
    return error;
  }
};
