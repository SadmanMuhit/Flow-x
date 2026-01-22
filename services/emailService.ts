import ejs from 'ejs';
import path from 'path';
import nodemailer from 'nodemailer';

const  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    service: process.env.SMTP_SERVICE,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export interface EmailData{
    to: string;
    name: string;
    url?: string;
    dashboardUrl?: string;
    [key: string]: any;
}

export class EmailService{
       private static async randerTemplate(templateName:string, data:EmailData): Promise<string>{
        const templatePath = path.join(process.cwd(), 'templates',"src", "templates","emails", `${templateName}.ejs`);

        return new Promise((resolve, reject)=>{
            ejs.renderFile(templatePath, data, (err:any, html:string)=>{
                if(err){
                    console.log("Error rendering email template:", err);
                    reject(err);
                }else{
                    resolve(html);
                }
            
            });
        });
    }
    private static async sendEmail(to:string, subject:string, html:string):Promise<boolean>{
        try {
            await  transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject,
                html,
            }); 
            return true;
        } catch (error) {
            return false;
        }
}
 static async sendVerificationEmail(data: EmailData): Promise<boolean>{
    try {
        const html = await this.randerTemplate("email-verification", data);
        return await this.sendEmail(data.to, "verify your email address - Flow-x", html)
    } catch (error) {
        console.error("error sending verification email:",error);
        return false;
    }
 }
}