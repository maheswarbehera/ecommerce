import nodemailer from "nodemailer";
import envConfig from "../env.config.js";
import { logger } from "../middlewares/index.js"; 

const transporter = nodemailer.createTransport({
    host: envConfig.EMAIL_SERVICE,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: envConfig.EMAIL_USER,
      pass: envConfig.EMAIL_PASSWORD,
    },
});

const register = async (email, username) => {
  try {
    const info = await transporter.sendMail({
      from: envConfig.EMAIL_USER,
      to: email,
      subject: "User Registration Successful",
      text: "You have successfully registered!",
      html: ` <b>Hi ${username},</b><br><br>

    Welcome to <b>Node Server!</b><br>
    You’re now part of a growing community. To begin, log in to your account and discover the exciting features waiting for you.<br><br>

    If you have any questions, our support team is here to help: <a href="mailto:support@example.com">support@example.com</a><br><br>

    <b>Username:</b> ${username}<br>
    <b>Log in now:</b> <a href="http://${envConfig.HOST}/api/v1/login">http://${envConfig.HOST}/api/v1/login</a><br><br>

    Best regards,<br>
    <b>Node Server Team</b>`,
    }); 
    logger.info(`Email sent successfully , ${info.messageId}`);
    return info;
  } catch (error) { 
    logger.error("Failed to send email:", error);
    return error;
  }
};
const forgotPassword = async (email, username, resetLink) => {
  try {
    const info = await transporter.sendMail({
      from: envConfig.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: "Reset Password",
      html: ` <b>Hi ${username},</b><br><br>
      You have requested a password reset for your account. Please click on the link below to reset your password.<br><br>
      <a href="${resetLink}">Reset Password</a><br><br>
      <p>This link will expire in 15 minutes.</p>
      If you did not request a password reset, please ignore this email.<br><br>
      Best regards,<br>
      <b>Node Server Team</b>`,
    });
    logger.info(`Email sent successfully , ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error("Failed to send email:", error);
    return error;
  }
}


export const sendMail = {
  register,
  forgotPassword
};