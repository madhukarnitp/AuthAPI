const emailBody = (method, code, fullname = "User") => {
  if (method === "verificationLink") {
    return `<!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial;">
        <table width="100%" style="padding:30px 0;background:#f4f6f8">
            <tr>
            <td align="center">
                <table width="600" style="background:#fff;border-radius:10px;padding:40px">
                <tr>
                    <td align="center" style="font-size:24px;font-weight:bold;color:#222">
                    ✉️ Verify Your Email
                    </td>
                </tr>
                <tr><td height="20"></td></tr>
                <tr>
                    <td style="font-size:16px;color:#555">
                    Hello ${fullname} 👋,<br><br>
                    Please verify your email by clicking the button below.
                    </td>
                </tr>
                <tr><td height="30"></td></tr>
                <tr>
                    <td align="center">
                    <a href="${code}"
                        style="background:#4f46e5;color:white;text-decoration:none;padding:14px 28px;border-radius:6px;font-weight:bold">
                        ✅ Verify Email
                    </a>
                    </td>
                </tr>
                <tr><td height="30"></td></tr>
                <tr>
                    <td style="font-size:14px;color:#777">
                    If the button doesn't work, open this link:<br>
                    <a href="${code}">${code}</a>
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        </body>
        </html>`;

  }

  if (method === "OTP") {
    return `<!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial">
        <table width="100%" style="background:#f4f6f8;padding:30px 0">
            <tr>
            <td align="center">
                <table width="600" style="background:#fff;border-radius:10px;padding:40px">
                <tr>
                    <td align="center" style="font-size:24px;font-weight:bold;color:#222">
                    🔒 Verify Your Identity
                    </td>
                </tr>
                <tr><td height="20"></td></tr>
                <tr>
                    <td style="font-size:16px;color:#555">
                    Hello ${fullname} 👋,<br><br>
                    Use the code below to complete verification.
                    </td>
                </tr>
                <tr><td height="30"></td></tr>
                <tr>
                    <td align="center">
                    <table width="100%" style="background:#eef2ff;border:2px dashed #4f46e5;border-radius:8px;padding:25px">
                        <tr>
                        <td align="center">
                            <span style="font-size:36px;font-weight:bold;color:#4f46e5;letter-spacing:6px">
                            ${code}
                            </span>
                        </td>
                        </tr>
                    </table>
                    </td>
                </tr>
                <tr><td height="20"></td></tr>
                <tr>
                    <td style="font-size:14px;color:#777">
                    ⏳ Valid for 10 minutes<br><br>
                    ⚠️ Never share this code with anyone.
                    </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        </body>
        </html>`;
  }

  return "";
};

module.exports = emailBody;
