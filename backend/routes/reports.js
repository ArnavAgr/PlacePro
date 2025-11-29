const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { verifyToken, requireRole } = require('../middleware/auth');

// Get placement statistics
router.get('/stats', verifyToken, requireRole('PLACEMENT_CELL'), async (req, res) => {
    try {
        const totalStudents = await prisma.student.count();
        const totalJobs = await prisma.job.count();
        const totalApplications = await prisma.application.count();
        const totalOffers = await prisma.offer.count();
        const placedStudents = await prisma.application.count({ where: { status: 'ACCEPTED' } });

        res.json({
            totalStudents,
            totalJobs,
            totalApplications,
            totalOffers,
            placedStudents,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;
