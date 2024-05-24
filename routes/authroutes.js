import express from 'express';
import { db } from '../db.js';
import { hashPassword, checkPassword, generateToken } from '../service/auth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, email, password, role } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    await db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, role]);
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).send({ message: 'Email already exists' });
    } else {
      console.log(error);
      res.status(500).send({ message: 'Error registering user' });
    }
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).send({ message: 'User not found' });
    }

    const user = users[0];
    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user.id, email: user.email, name: user.username, role: user.role });
    res.cookie('token', token, { httpOnly: true });
    res.send({ token, name: user.username,role: user.role }); 
  } catch (error) {
    res.status(500).send({ message: 'Error logging in' });
  }
});

export default router;
