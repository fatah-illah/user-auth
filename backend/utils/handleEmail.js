const nodemailer = require("nodemailer");
const pug = require("pug");

require("dotenv").config();

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.from = '"Fatahillah 👻" <fatahillah@rediffmail.com>';
    this.url = url;
    this.name = user.name;
  }
  createTransporter() {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    return transporter;
  }

  // createTransporter() {
  //   if (process.env.NODE_ENV === "development") {
  //     let transporter = nodemailer.createTransport({
  //       host: process.env.EMAIL_HOST,
  //       port: process.env.EMAIL_PORT,
  //       secure: false, // true for 465, false for other ports
  //       auth: {
  //         user: process.env.EMAIL_USERNAME, // generated ethereal user
  //         pass: process.env.EMAIL_PASSWORD, // generated ethereal password
  //       },
  //     });
  //     return transporter;
  //   }

  //   if (process.env.NODE_ENV === "production") {
  //     let transporter = nodemailer.createTransport({
  //       service: "SendinBlue", // no need to set host or port etc.
  //       auth: {
  //         user: process.env.SENDINBLUE_USERNAME, // generated ethereal user
  //         pass: process.env.SENDINBLUE_PASSWORD, // generated ethereal password
  //       },
  //     });
  //     return transporter;
  //   }
  // }

  // Function to send the email to reset password
  // async sendEmailToResetPassword(template, emailOptions) {
  //   // Render HTML based on the template provided

  //   // Set path to the template file
  //   const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
  //     url: this.url,
  //     text: emailOptions.text,
  //     name: this.name,
  //   });

  //   // Set the email options
  //   let mailOptions = {
  //     from: this.from,
  //     to: this.to,
  //     subject: emailOptions.subject,
  //     html: html,
  //   };

  //   // Create a transport for sending email and also change the sendMail function
  //   await this.createTransporter().sendMail(mailOptions);
  // }
}

module.exports = Email;
