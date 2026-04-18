export const emailTemplete = (otp, fullName) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OTP Verification</title>
</head>

<body style="margin:0; padding:0; background:#f5f5f5; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:20px;">

        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; padding:30px; border-radius:8px;">
          
          <!-- Title -->
          <tr>
            <td style="text-align:center; font-size:20px; font-weight:bold; color:#333;">
              🔐 Verify Your Account
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding-top:20px; color:#555; font-size:14px; line-height:1.6;">
              <p>Hi,${fullName}</p>

              <p>Use the following OTP code to complete your verification:</p>

              <!-- OTP BOX -->
              <div style="text-align:center; margin:30px 0;">
                <span style="
                  display:inline-block;
                  background:#4f46e5;
                  color:#ffffff;
                  padding:15px 25px;
                  font-size:22px;
                  letter-spacing:5px;
                  border-radius:6px;
                  font-weight:bold;
                ">
                  ${otp}
                </span>
              </div>

              <p>This code will expire shortly. Do not share it with anyone.</p>

              <p>If you didn’t request this, you can safely ignore this email.</p>

              <p>Thanks,<br><strong>Fatma Refaat</strong></p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};