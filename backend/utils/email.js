// email.js
const { htmlToText } = require('html-to-text');
const nodemailer = require('nodemailer');
const pug = require('pug');
const fs = require('fs');
const path = require('path');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.username.split(' ')[0];
    this.url = url;
    this.from = `FPT University Social Website <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'gmail',
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_USERNAME,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    }
    
    // Local development
    return nodemailer.createTransport({
      service: 'gmail',
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async send(template, subject, options = {}) {
    const templatePath = path.resolve(
      __dirname,
      '../templates',
      `${template}.pug`
    );
    const html = fs.readFileSync(templatePath, 'utf-8');
    const compiledFunction = pug.compile(html);
    const replacedHtml = compiledFunction({
      firstName: this.firstName,
      url: this.url,
      subject,
      ...options,
    });

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: replacedHtml,
      text: htmlToText(replacedHtml),
    };

    try {
      await this.newTransport().sendMail(mailOptions);
    } catch (error) {
      console.log(error);
    }
  }

  async sendWelcome() {
    await this.send(
      'emailTemplate',
      'Welcome to the FPT University Social Website'
    );
  }

  async sendResetPassword(newPassword) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: "Your new password",
      text: `Your new password is: ${newPassword}\nPlease log in and change it as soon as possible.`,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendPassword(password) {
    await this.send('newUserTemplate', 'Your Account Password', { password });
  }
};
