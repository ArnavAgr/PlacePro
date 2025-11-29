import React, { useEffect, useState } from 'react';
import axios from '../services/auth';
import { useAlert } from '../context/AlertContext';

export default function ApproveJobs() {
    const [pendingJobs, setPendingJobs] = useState([]);
    const [approvedJobs, setApprovedJobs] = useState([]);
    const { showAlert } = useAlert();

    useEffect(() => {
        fetchJobs();
    }, []);

    async function fetchJobs() {
        try {
            const [pendingRes, approvedRes] = await Promise.all([
                axios.get('/jobs/pending'),
                axios.get('/jobs/approved')
            ]);
            setPendingJobs(pendingRes.data);
            setApprovedJobs(approvedRes.data);
        } catch (err) {
            console.error(err);
            showAlert('Failed to fetch jobs', 'error');
        }
    }

    async function approveJob(id) {
        try {
            await axios.post(`/jobs/${id}/approve`);
            showAlert('Job approved successfully', 'success');
            fetchJobs(); // Refresh lists
        } catch (err) {
            console.error(err);
            showAlert('Failed to approve job', 'error');
        }
    }

    return (
        <div className="dashboard-container">
            <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Job Approvals & History</h2>

            <div className="card" style={{ marginBottom: '32px' }}>
                <h3 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Pending Approvals
                    {pendingJobs.length > 0 && <span className="badge warning">{pendingJobs.length}</span>}
                </h3>
                {pendingJobs.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No jobs waiting for approval.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Company</th>
                                <th>Posted On</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingJobs.map(job => (
                                <tr key={job.id}>
                                    <td><strong>{job.title}</strong></td>
                                    <td>{job.postedBy?.companyName || 'N/A'}</td>
                                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn btn-primary" onClick={() => approveJob(job.id)}>Approve</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="card">
                <h3 style={{ marginTop: 0 }}>Previously Approved Jobs</h3>
                {approvedJobs.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No approved jobs history found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Company</th>
                                <th>Status</th>
                                <th>Applications</th>
                                <th>Posted On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvedJobs.map(job => (
                                <tr key={job.id}>
                                    <td><strong>{job.title}</strong></td>
                                    <td>{job.postedBy?.companyName || 'N/A'}</td>
                                    <td>
                                        <span className={`badge ${job.status === 'ACTIVE' ? 'success' : 'danger'}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td>{job._count?.applications || 0}</td>
                                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
