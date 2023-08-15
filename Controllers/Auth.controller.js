const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const moongoose=require('mongoose')


const AuthRouter = express.Router();
const UserModel = require('../Models/Users.model');

const JWT_SECRET = 'your-secret-key'; // Replace with a secure and private key

// Sign In User
AuthRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        res.send({ message: 'login success', user: user });
      } else {
        res.send({ message: 'wrong credentials' });
      }
    } else {
      res.send({ message: 'not registered' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send({ message: 'An error occurred' });
  }
});

// Register User
AuthRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      res.send({ message: 'User already exists' });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({ name, email, password: hashedPassword });
      await newUser.save();
      res.send({ message: 'Successfully registered' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'An error occurred' });
  }
});

// Forgot Password
AuthRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ status: 'User not found' });
    }

    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET, {
      expiresIn: '15m',
    });

    const resetLink = `http://localhost:5000/reset-password/${user._id}/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'gurunathganesh@gmail.com',
        pass: 'majohanbzeeuhwis',
      },
    });

    const mailOptions = {
      from: 'gurunathganesh@gmail.com',
      to: 'gurunathganesh6@gmail.com',
      subject: 'Password Reset',
      text: resetLink,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    console.log(resetLink);
    res.json({ status: 'Password reset link sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send({ message: 'An error occurred' });
  }
});


// Reset Password

AuthRouter.post('/reset-password', async (req, res) => {
  const { id, token } = req.query;
// console.log(id)
  try {
    const user = await UserModel.findOne({ _id: new moongoose.Types.ObjectId(id) });
    // console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      if (decodedToken.email !== user.email) {
        return res.status(401).json({ message: 'Unauthorized access' });
      }

      const { password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      await user.save();

      res.json({ message: 'Password reset successfully' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});




module.exports = AuthRouter;
