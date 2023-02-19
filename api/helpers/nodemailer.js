const nodemailer = require("nodemailer");
const EMAIL_LOG = require("../app/emailLogs/model/emailModel");
const constant = require("../helpers/constant");

module.exports = {
  async sendMail(to, subject, text, from) {
    const transporter = nodemailer.createTransport({
      // create smtp protocol values
      host: "smtp.hmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
      },
    });

    let mailOptions = {
      // set data for mail options
      from: process.env.AUTH_EMAIL,
      to: to,
      subject: subject,
      text: text,
    };
    return new Promise(function (resolve, reject) {
      // use send mail function to send mail to other user
      transporter.sendMail(mailOptions, async (err, res) => {
        if (err) {
          let sendError = await EMAIL_LOG.create({
            to: mailOptions.to,
            subject: `Verification Code `,
            text: err.Error,
            from: mailOptions.from,
            state: constant.PENDING,
          });
        //   if (sendError) {
            console.log('reject', reject)
            reject(Error(err.Error));
        //   }
        } else {
          let sendConfirmation = await EMAIL_LOG.create({
            to: mailOptions.to,
            subject: `Verification Code `,
            from: mailOptions.from,
            text: `Congratuations, Signup successful`,
            state: constant.SENT,
          });
          if (sendConfirmation) {
            // else send success into resolve
            resolve(0);
          }
        }
      });
    });
  },

  async resetPasswordLink(to, subject, html, text, from) {
    const transporter = nodemailer.createTransport({
      // create smtp protocol values
      host: "smtp.hmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
      },
    });

    let mailOptions = {
      // set data for mail options
      from: process.env.AUTH_EMAIL,
      to: to,
      subject: subject,
      html: html,
    };
    return new Promise(function (resolve, reject) {
      // use send mail function to send mail to other user
      transporter.sendMail(mailOptions, async (err, res) => {
        if (err) {
          let sendError = await EMAIL_LOG.create({
            to: mailOptions.to,
            subject: `Reset Password`,
            text: err.Error,
            from: mailOptions.from,
            state: constant.PENDING,
          });
          if (sendError) {
            reject(Error(err.Error));
          }
        } else {
          let sendConfirmation = await EMAIL_LOG.create({
            to: mailOptions.to,
            subject: `Reset Password `,
            from: mailOptions.from,
            text: `Reset Password Successful`,
            state: constant.SENT,
          });
          if (sendConfirmation) {
            // else send success into resolve
            resolve(0);
          }
        }
      });
    });
  },

  EMAILHTML(link) {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reset Password</title>
                <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
            </head>
            <body style=" min-width:260px; min-height:100%; margin:auto; padding:0; background-color: #f3f3f3; box-sizing: inherit; font-family: 'Roboto'; font-weight: 400;">
                <table style="background-color: #f3f3f3; max-width: 100%; width: 700px; margin: 0 auto; border-collapse: collapse;">
                    <tbody>
                        <tr>
                            <td style="height:80px; background-color: #fff;  padding:0 15px; border-collapse: collapse;"></td>
                        </tr>
                        <tr>
                            <td style="background: #fff; text-align: center; border-collapse: collapse;">
                                <img src="http://victory.quick.in/assets/images/logo.png" alt="logo-icon">
                            </td>
                        </tr>
                      
                        <td style="height:40px; background-color: #fff"></td>
                        <tr style="background-color: #fff">
                            <td style="text-align: center; color: #000; font-size: 25px; font-weight: 600;  padding: 0 15px; border-collapse: collapse;">
                                Password Reset
                            </td>
                        </tr>
                        <tr>
                            <td style="height:40px; background-color: #fff"; border-collapse: collapse;></td>
                        </tr>
                        <tr style="background-color: #fff;">
                            <td style=" color: #000; font-size: 25px; font-weight: 500; text-align: center;  padding: 0 15px; border-collapse: collapse;">
                                If you've lost your password or wish to reset it, <br> use the link below
                            </td>
                        </tr>
                        <td style="height:10px; background-color: #fff"; border-collapse: collapse;></td>
                        <tr>
                            <td style="height:40px; background-color: #fff; text-align: center; vertical-align: middle; padding: 0 15px; border-collapse: collapse; ">
                                <a href= ${link} style="padding: 10px 0; line-height: 40px; background-color: #fd914e; text-align: center; color: #fff; font-size: 25px; font-weight: 600; border-radius: 10px; display: block; text-decoration: none;">Reset Your Password</a></td>
                        </tr>
                        <tr>
                            <td style="height:20px; background-color: #fff"; border-collapse: collapse;></td>
                        </tr>
            
                        <tr>
                            <td style="background-color: #fff; text-align: center; color: #7c7c7c; font-size: 14px; font-weight: 500; padding: 0 15px; border-collapse: collapse;">
                                <i>If you did not request a password reset, you can safely ignore this email. </i>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:10px; background-color: #fff"; border-collapse: collapse;></td>
                        </tr>
                        <tr>
                            <td style="background-color: #fff; text-align: center; color: #7c7c7c; font-size: 14px; font-weight: 500;  padding: 0 15px; border-collapse: collapse;">
                                <i>only a person with access to your email can reset your account</i>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:10px; background-color: #fff"; border-collapse: collapse;></td>
                        </tr>
                        <tr>
                            <td style="background-color: #fff; text-align: center; color: #7c7c7c; font-size: 14px; font-weight: 500;  padding: 0 15px; border-collapse: collapse;">
                                <i>2022 Bobelle,</i> France
                            </td>
                        </tr>
                        <tr>
                            <td style="height:80px; background-color: #fff"; border-collapse: collapse;></td>
                        </tr>
                    </tbody>
                </table>
            </body>
            </html>`;
  },
};
