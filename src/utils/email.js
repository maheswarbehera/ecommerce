import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env.development",
});
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: "alexys.wunsch66@ethereal.email",
      pass: "vjwXDnMTby32VxhQGj",
    },
});

const sendMail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions); 
    return info;
  } catch (error) { 
    throw error;
  }
};

export default sendMail;