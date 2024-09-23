import nodemailer from 'nodemailer';
export async function sendEmail(to, subject, htmlContent) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: 'santoshk.onclick@gmail.com',
      to,
      subject,
      html: htmlContent,
    };

    // Send email and return success
    await transporter.sendMail(mailOptions);
    return { success: true };

  } catch (error) {
    // Log and return the error to the service layer
    return { success: false, message: `Email sending failed: ${error.message}` };
  }
}
