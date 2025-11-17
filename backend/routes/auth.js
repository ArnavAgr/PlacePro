const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Register - only student
router.post('/register', async (req, res) => {
  const { email, password, rollNo, branch } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const existing = await prisma.user.findUnique({ where: { email }});
  if (existing) return res.status(400).json({ error: 'Email already exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, role: 'STUDENT' }});
  await prisma.student.create({ data: { userId: user.id, rollNo, branch }});
  res.status(201).json({ message: 'Registered' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '6h' });
  res.json({ token, role: user.role });
});

module.exports = router;
