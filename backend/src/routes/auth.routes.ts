import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await AppDataSource.getRepository(User).findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User();
    user.email = email;
    user.passwordHash = passwordHash;
    await AppDataSource.getRepository(User).save(user);
    
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AppDataSource.getRepository(User).findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
