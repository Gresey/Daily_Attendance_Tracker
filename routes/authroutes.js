import express from 'express';
import { db } from '../sqlserver.js';
import { hashPassword, generateToken } from '../service/auth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, email, password, confirmPassword, role } = req.body;

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).send('Passwords do not match');
  }

  // Hash the password
  const hashedPassword = await hashPassword(password);

  try {
    // Insert the new user into the database
    const [result] = await db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, role]);
    res.status(201).send('User registered successfully');
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // This error code is returned by MySQL if a duplicate key is attempted to be inserted, such as a unique email
      return res.status(409).send('Email already exists');
    }
    console.log(error);
    res.status(500).send('Error registering user');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = users[0];
    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid credentials');
    }

    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true });
    res.send('Login successful');
  } catch (error) {
    res.status(500).send('Error logging in');
  }
});

export default router;

