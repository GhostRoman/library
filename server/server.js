require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const emailService = require("./services/emailService");
const schedule = require("node-schedule");

const app = express();

// Check for essential environment variables
if (
  !process.env.MONGO_URI,
  !process.env.PORT,
  !process.env.EMAIL_USER,
  !process.env.EMAIL_PASS
) {
  throw new Error(
    "Missing essential environment variables. Please check your .env file.",
  );
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect('mongodb+srv://ghostroman:ofQKHbqOIc4RlCja@cluster0.nvy5j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err));

// Route handlers
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);

// Schedule weekly email newsletter every Monday at 9 AM
schedule.scheduleJob("0 9 * * 1", async function () {
  try {
    await emailService.sendWeeklyNewsletter();
    console.log("Weekly newsletter sent successfully.");
  } catch (error) {
    console.error("Error sending weekly newsletter:", error);
  }
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
