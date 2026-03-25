import { EMAIL, PASSWORD } from "../../../../config/config.service.js";
import  nodemailer  from "nodemailer";

export const sendEmail=async({to,subject,html,attachments})=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL,
          pass: PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from: `Fatma's SarahaApp <${EMAIL}`,
        to,
        subject: subject||'Hello',
        html: html||"<b>Hello from SarahaApp</b>",
        attachments: attachments||[]
      });
    console.log("Message sent:", info.messageId);
    return info.accepted.length>0?true:false
}

export const generateOtp=async()=>{
    return Math.floor(Math.random() * 90000+10000);
}