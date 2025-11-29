const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { verifyToken, requireRole } = require('../middleware/auth');

// Create job - only RECRUITER
router.post('/', verifyToken, requireRole('RECRUITER'), async (req, res) => {
  const { title, description, eligibility, deadline } = req.body;
  const postedByUserId = req.user.userId;
  const job = await prisma.job.create({
    data: { title, description, eligibility, deadline: deadline ? new Date(deadline) : null, postedByUserId, status: 'PENDING_APPROVAL' },
  });
  res.status(201).json(job);
});

// List active jobs (students see ACTIVE)
router.get('/', async (req, res) => {
  const jobs = await prisma.job.findMany({ where: { status: 'ACTIVE' }, orderBy: { createdAt: 'desc' } });
  res.json(jobs);
});

// List jobs posted by logged-in recruiter
router.get('/my-jobs', verifyToken, requireRole('RECRUITER'), async (req, res) => {
  const postedByUserId = req.user.userId;
  const jobs = await prisma.job.findMany({
    where: { postedByUserId },
    include: { applications: true }, // Include application count
    orderBy: { createdAt: 'desc' },
  });
  res.json(jobs);
});

// List pending jobs - only PLACEMENT_CELL
router.get('/pending', verifyToken, requireRole('PLACEMENT_CELL'), async (req, res) => {
  const jobs = await prisma.job.findMany({
    where: { status: 'PENDING_APPROVAL' },
    include: { postedBy: { select: { companyName: true } } },
    orderBy: { createdAt: 'asc' },
  });
  res.json(jobs);
});

// Approve job - only PLACEMENT_CELL
router.post('/:id/approve', verifyToken, requireRole('PLACEMENT_CELL'), async (req, res) => {
  const id = req.params.id;
  const job = await prisma.job.update({ where: { id }, data: { status: 'ACTIVE' } });
  res.json(job);
});

// Get single job details
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

module.exports = router;
