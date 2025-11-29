import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/auth';

export default function ManageApplications() {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    async function fetchApplications() {
        try {
            const res = await axios.get(`/applications/job/${jobId}`);
            setApplications(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch applications');
            setLoading(false);
        }
    }

    async function updateStatus(appId, status, extraData = {}) {
        try {
            await axios.patch(`/applications/${appId}/status`, { status, ...extraData });
            alert(`Status updated to ${status}`);
            fetchApplications(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    }

    async function scheduleInterview(appId) {
        const date = prompt('Enter interview date (YYYY-MM-DD):');
        if (!date) return;
        updateStatus(appId, 'INTERVIEW_SCHEDULED', { interviewDate: date });
    }

    async function createOffer(appId) {
        const details = prompt('Enter offer details (Salary, Role, etc.):');
        if (!details) return;

        try {
            await axios.post('/offers/create', { appId, details });
            alert('Offer created successfully');
            fetchApplications();
        } catch (err) {
            console.error(err);
            alert('Failed to create offer');
        }
    }

    if (loading) return <p>Loading applicants...</p>;

    return (
        <div className="manage-apps-container">
            <h2>Manage Applications</h2>
            {applications.length === 0 ? (
                <p>No applications yet.</p>
            ) : (
                <table className="apps-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Status</th>
                            <th>Resume</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app.id}>
                                <td>{app.student.user.email}</td>
                                <td>{app.status}</td>
                                <td>
                                    {app.resumeFilePath && (
                                        <a href={`http://localhost:4000/${app.resumeFilePath}`} target="_blank" rel="noopener noreferrer">
                                            View Resume
                                        </a>
                                    )}
                                </td>
                                <td>
                                    {app.status === 'APPLIED' && (
                                        <>
                                            <button onClick={() => updateStatus(app.id, 'SHORTLISTED')}>Shortlist</button>
                                            <button onClick={() => updateStatus(app.id, 'REJECTED')}>Reject</button>
                                        </>
                                    )}
                                    {app.status === 'SHORTLISTED' && (
                                        <button onClick={() => scheduleInterview(app.id)}>Schedule Interview</button>
                                    )}
                                    {app.status === 'INTERVIEW_SCHEDULED' && (
                                        <button onClick={() => createOffer(app.id)}>Create Offer</button>
                                    )}
                                    {app.status === 'OFFERED' && <span>Offer Sent</span>}
                                    {app.status === 'ACCEPTED' && <span>Placed</span>}
                                    {app.status === 'REJECTED' && <span>Rejected</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
