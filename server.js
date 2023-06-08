require('dotenv').config(); 
const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
const port = 5005; 
app.use(cors({ origin: 'http://localhost:5173' }));


app.use(express.json());


const oAuth2Client = new google.auth.OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' 
);

oAuth2Client.setCredentials({
  refresh_token: process.env.EMAIL_REFRESH_TOKEN,
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.EMAIL_CLIENT_ID,
    clientSecret: process.env.EMAIL_CLIENT_SECRET,
    refreshToken: process.env.EMAIL_REFRESH_TOKEN,
    accessToken: oAuth2Client.getAccessToken(),
  },
});


app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body;

  try {
   
    const mailOptions = {
      from: email, 
      to: process.env.EMAIL_USER,
      subject: 'You got a form submission!',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };


    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




