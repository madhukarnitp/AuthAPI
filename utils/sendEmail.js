const nodemailer = require("nodemailer");
const emailBody = require("./emailBody");

const sendEmail = async (to, subject, code, method, fullname) => {

  const htmlTemplate = emailBody(method, code, fullname);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS_KEY,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlTemplate,
  });
};

module.exports = sendEmail;