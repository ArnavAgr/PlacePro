const express = require('express');
const router = express.Router();
const prisma = require('../prismaClient');
const { verifyToken, requireRole } = require('../middleware/auth');

// Create an offer - Recruiter only
router.post('/create', verifyToken, requireRole('RECRUITER'), async (req, res) => {
    const { appId, details } = req.body;

    try {
        // Check if application exists
        const application = await prisma.application.findUnique({ where: { id: appId } });
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        // Create offer
        const offer = await prisma.offer.create({
            data: {
                appId,
                details,
                status: 'PENDING',
                issuedOn: new Date(),
            },
        });

        // Update application status to OFFERED
        await prisma.application.update({
            where: { id: appId },
            data: { status: 'OFFERED' },
        });

        res.status(201).json(offer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create offer' });
    }
});

// Get all offers - Placement Cell only
router.get('/all', verifyToken, requireRole('PLACEMENT_CELL'), async (req, res) => {
    try {
        const offers = await prisma.offer.findMany({
            include: {
                application: {
                    include: {
                        student: { include: { user: { select: { email: true } } } },
                        job: { include: { postedBy: { select: { companyName: true } } } },
                    },
                },
            },
        });
        res.json(offers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
});

// Respond to offer - Student only
router.put('/:id/respond', verifyToken, requireRole('STUDENT'), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // ACCEPTED or REJECTED

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const offer = await prisma.offer.update({
            where: { id },
            data: { status },
            include: { application: true },
        });

        // Update Application status
        await prisma.application.update({
            where: { id: offer.appId },
            data: { status },
        });

        res.json(offer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to respond to offer' });
    }
});

module.exports = router;
