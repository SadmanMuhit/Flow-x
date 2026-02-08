import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";

export const emailService = {
  sendVerificationEmail: async ({ to, name, url }: { to: string; name: string; url: string }) => {
    const html = await ejs.renderFile(path.join(process.cwd(), "views", "emailTemplate.ejs"), { name, url });

    const transporter = nodemailer.createTransport({
      host: "smtp.example.com", // replace with your SMTP
      port: 587,
      secure: false,
      auth: {
        user: "your@email.com",
        pass: "yourpassword",
      },
    });

    await transporter.sendMail({
      from: '"FlowX Team" <no-reply@flowx.com>',
      to,
      subject: "Verify Your Email",
      html,
    });
  },
};