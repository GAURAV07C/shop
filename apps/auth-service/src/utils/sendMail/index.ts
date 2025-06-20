import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE, // e.g., 'gmail', 'yahoo', etc.
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Render the email template

const renderEmailTemplate = async (templateName: string, data: Record<string, any>) : Promise<string> => {
    // This function renders an EJS template file located in the email-templates directory
    // The templateName should be the name of the EJS file without the extension
    const templatePath = path.join(process.cwd(), 
    'auth-service',
    'utils',
    'src',
    'email-templates',
     'templates',
      `${templateName}.ejs`
    );

    return ejs.renderFile(templatePath, data)
    
}

// this function sends an email using the nodemailer transporter

export const sendEMail = async (to: string, subject: string, templateName: string, data: Record<string, any>)  => {
    try {
        const html = await renderEmailTemplate(templateName, data);
    
        const mailOptions = {
        from: `<${process.env.SMTP_USER}`,
        to,
        subject,
        html,
        };
    
        await transporter.sendMail(mailOptions);
        return true
    } catch (error) {
        console.error('Error sending email:', error);
        return false
    }
}