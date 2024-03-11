const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = 2024; // Use environment variable for port or default to 3000
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail", // Replace with your preferred email service (e.g., 'hotmail', 'yahoo')
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/send", async (req, res) => {
  if (req.body) {
    const { recipient, subject, message } = req.body;

    if (!recipient || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipient,
        subject: subject,
        html: message,
        //    text: message, // Use HTML for formatted emails
      };

      const info = await transporter.sendMail(mailOptions);

      res.json({ message: `Email sent successfully: ${info.response}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to send email" });
    }
  } else {
    res.status(400).json({ error: "Missing data in request body" });
    // Handle the case where req.body is undefined
  }
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
