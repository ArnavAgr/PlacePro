const express = require('express');
const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resumes'); // Save files in the "uploads/resumes" directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.userId}-${Date.now()}${ext}`); // Unique filename
  },
});
const upload = multer({ storage });

// Student Sign-Up
router.post('/sign-up', async (req, res) => {
  const { email, password, rollNo, branch, cgpa } = req.body;

  try {
    // Validate required fields
    if (!email || !password || !rollNo) {
      return res.status(400).json({ error: 'Email, password, and roll number are required' });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the user and student records
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'STUDENT',
        student: {
          create: {
            rollNo,
            branch,
            cgpa: cgpa ? parseFloat(cgpa) : null,
          },
        },
      },
    });

    res.status(201).json({ message: 'Student created successfully', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Get student profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { userId: req.user.userId },
      include: { user: { select: { email: true, role: true } } },
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update student profile
router.put('/profile', verifyToken, async (req, res) => {
  const { cgpa, skills, rollNo, branch } = req.body;
  try {
    const student = await prisma.student.update({
      where: { userId: req.user.userId },
      data: {
        cgpa: cgpa ? parseFloat(cgpa) : undefined,
        skills,
        rollNo,
        branch
      },
    });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Upload resume route
router.post('/upload-resume', verifyToken, upload.single('resume'), async (req, res) => {
  console.log('Upload resume request received');
  console.log('User:', req.user);
  console.log('File:', req.file);
  const studentUserId = req.user.userId;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Update the student's resumeFilePath in the database
    await prisma.student.update({
      where: { userId: studentUserId },
      data: { resumeFilePath: filePath },
    });

    res.json({ message: 'Resume uploaded successfully', filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

module.exports = router;
