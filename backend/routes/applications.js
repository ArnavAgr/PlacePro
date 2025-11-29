const express = require('express');
const prisma = require('../prismaClient');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get applications for the logged-in student
router.get('/', verifyToken, async (req, res) => {
  const studentUserId = req.user.userId;

  try {
    const applications = await prisma.application.findMany({
      where: { studentUserId },
      include: { job: true, offer: true }, // Include job and offer details
    });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Apply for a job
router.post('/apply', verifyToken, async (req, res) => {
  const { jobId } = req.body;
  const studentUserId = req.user.userId;

  try {
    // Check if already applied
    const existingApp = await prisma.application.findUnique({
      where: {
        jobId_studentUserId: {
          jobId,
          studentUserId,
        },
      },
    });

    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Get student's current resume
    const student = await prisma.student.findUnique({
      where: { userId: studentUserId },
    });

    if (!student || !student.resumeFilePath) {
      return res.status(400).json({ error: 'Please upload a resume before applying' });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId,
        studentUserId,
        resumeFilePath: student.resumeFilePath, // Snapshot of resume
        status: 'APPLIED',
      },
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to apply for job' });
  }
});

// Get applicants for a job (Recruiter only)
router.get('/job/:jobId', verifyToken, async (req, res) => {
  const { jobId } = req.params;
  // TODO: Verify that the recruiter owns this job
  try {
    const applications = await prisma.application.findMany({
      where: { jobId },
      include: { student: { include: { user: { select: { email: true } } } } },
    });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
});

// Update application status
router.patch('/:id/status', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { status, interviewDate } = req.body;

  try {
    const data = { status };
    if (interviewDate) {
      data.interviewDate = new Date(interviewDate);
    }

    const application = await prisma.application.update({
      where: { id },
      data,
    });
    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
