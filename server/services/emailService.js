const nodemailer = require("nodemailer");
const User = require("../models/User");
const Book = require("../models/Book");

if (
  !process.env.EMAIL_HOST ||
  !process.env.EMAIL_PORT ||
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS ||
  !process.env.CLIENT_URL
) {
  throw new Error(
    "One or more environment variables for email configuration are missing",
  );
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === "465", // Use secure connection for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send confirmation email
exports.sendConfirmationEmail = async (email, username, token) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Подтверждение регистрации",
    text: `Привет, ${username}!\n\nСпасибо за регистрацию. Пожалуйста, подтвердите свою учетную запись, перейдя по следующей ссылке:\n\nhttp://${process.env.CLIENT_URL}/confirm/${token}\n\nЕсли вы не регистрировались, просто проигнорируйте это письмо.`,
    html: `<p>Привет, ${username}!</p><p>Спасибо за регистрацию. Пожалуйста, подтвердите свою учетную запись, перейдя по <a href="http://${process.env.CLIENT_URL}/confirm/${token}">ссылке</a>.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending confirmation email to ${email}:`, error);
    throw error;
  }
};

// Function to send password reset email
exports.sendPasswordResetEmail = async (email, token) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset",
    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://${process.env.CLIENT_URL}/reset/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`,
    html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p><p>Please click on the following link, or paste this into your browser to complete the process:</p><p><a href="http://${process.env.CLIENT_URL}/reset/${token}">Reset Password</a></p><p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending password reset email to ${email}:`, error);
    throw error;
  }
};

// Function to send weekly newsletter
exports.sendWeeklyNewsletter = async () => {
  try {
    const users = await User.find();
    const books = await Book.find().sort("-createdAt").limit(5);

    const promises = users.map((user) => {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Weekly Book Newsletter",
        text: `Here are the latest books added to our library:\n\n${books.map((book) => `${book.title} by ${book.author}`).join("\n")}`,
        html: `<p>Here are the latest books added to our library:</p><ul>${books.map((book) => `<li>${book.title} by ${book.author}</li>`).join("")}</ul>`,
      };

      return transporter.sendMail(mailOptions);
    });

    await Promise.all(promises);
    console.log("Weekly newsletter sent successfully");
  } catch (error) {
    console.error("Error sending weekly newsletter:", error);
  }
};
