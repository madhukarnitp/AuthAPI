const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, code) => {
  const htmlTemplate = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial;">
    <table width="100%" style="background:#f4f6f8;padding:30px 0;">
        <tr>
            <td align="center">
                <table width="600" style="background:#fff;border-radius:10px;padding:40px;">
                    <tr>
                        <td align="center" style="font-size:24px;font-weight:bold;color:#222;"> ✉️ Verify Your Email
                        </td>
                    </tr>
                    <tr>
                        <td height="20"></td>
                    </tr>
                    <tr>
                        <td style="font-size:16px;color:#555;"> Hello 👋,<br /><br /> Please confirm your email address
                            by clicking the button below. </td>
                    </tr>
                    <tr>
                        <td height="30"></td>
                    </tr>
                    <tr>
                        <td align="center"> <a href="${code}"
                                style="background:#4f46e5;color:#fff;text-decoration:none; padding:14px 28px;border-radius:6px;font-size:16px; font-weight:bold;display:inline-block;">
                                ✅ Verify Email </a> </td>
                    </tr>
                    <tr>
                        <td height="30"></td>
                    </tr>
                    <tr>
                        <td style="font-size:14px;color:#777;"> If the button doesn't work, use this link:<br /> <a
                                href="${code}" style="color:#4f46e5;"> ${code} </a> <br /><br /> ⏳ Link
                            expires in 2 hours. </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  const transporter = nodemailer.createTransport({
    secure: true,
    
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS_KEY
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlTemplate
  });
};

module.exports = sendEmail;