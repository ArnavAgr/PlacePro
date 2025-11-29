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

// Get detailed analytics for charts
router.get('/analytics', verifyToken, requireRole('PLACEMENT_CELL'), async (req, res) => {
    try {
        // 1. Placement Status Distribution
        const totalStudents = await prisma.student.count();
        const placedStudentsList = await prisma.application.findMany({
            where: { status: 'ACCEPTED' },
            distinct: ['studentUserId'],
            select: { studentUserId: true }
        });
        const placedCount = placedStudentsList.length;
        const unplacedCount = totalStudents - placedCount;

        // 2. Branch-wise Stats
        // Group students by branch
        const studentsByBranch = await prisma.student.groupBy({
            by: ['branch'],
            _count: { userId: true }
        });

        // Get placed students by branch
        // Note: Prisma doesn't support complex joins in groupBy easily, so we'll fetch accepted apps and aggregate in JS
        const placedApps = await prisma.application.findMany({
            where: { status: 'ACCEPTED' },
            include: { student: { select: { branch: true } } }
        });

        const branchStats = studentsByBranch.map(b => {
            const branch = b.branch || 'Unknown';
            const total = b._count.userId;
            const placed = placedApps.filter(app => app.student?.branch === branch).length;
            return { branch, total, placed };
        });

        // 3. Top 5 Popular Jobs
        const popularJobs = await prisma.application.groupBy({
            by: ['jobId'],
            _count: { studentUserId: true },
            orderBy: { _count: { studentUserId: 'desc' } },
            take: 5
        });

        // Fetch job titles for these IDs
        const jobDetails = await prisma.job.findMany({
            where: { id: { in: popularJobs.map(j => j.jobId) } },
            select: { id: true, title: true, postedBy: { select: { companyName: true } } }
        });

        const topJobs = popularJobs.map(j => {
            const job = jobDetails.find(d => d.id === j.jobId);
            return {
                title: job ? `${job.title} (${job.postedBy?.companyName})` : 'Unknown Job',
                applications: j._count.studentUserId
            };
        });

        res.json({
            placementStatus: { placed: placedCount, unplaced: unplacedCount },
            branchStats,
            topJobs
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

module.exports = router;
