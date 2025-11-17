const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');
const { verifyToken, requireRole } = require('../middleware/auth');

// protected route: only PLACEMENT_CELL can create recruiters/placement users
router.post('/create-user', verifyToken, requireRole('PLACEMENT_CELL'), async (req, res) => {
  const { email, password, role, companyName } = req.body;
  if (!email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
  if (!['RECRUITER','PLACEMENT_CELL'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

  const existing = await prisma.user.findUnique({ where: { email }});
  if (existing) return res.status(400).json({ error: 'Email exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash, role }});

  if (role === 'RECRUITER') {
    await prisma.recruiter.create({ data: { userId: user.id, companyName }});
  } else if (role === 'PLACEMENT_CELL') {
    // optionally create extra placement profile
  }
  res.status(201).json({ message: 'User created', userId: user.id });
});

module.exports = router;
