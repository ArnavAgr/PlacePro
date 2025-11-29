import React, { useEffect, useState } from 'react';
import axios from '../services/auth';

export default function ApproveJobs() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchPendingJobs();
    }, []);

    async function fetchPendingJobs() {
        try {
            const res = await axios.get('/jobs/pending');
            setJobs(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch pending jobs');
        }
    }

    async function approveJob(id) {
        try {
            await axios.post(`/jobs/${id}/approve`);
            alert('Job approved successfully');
            fetchPendingJobs(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Failed to approve job');
        }
    }

    return (
        <div className="approve-jobs-container">
            <h2>Pending Job Approvals</h2>
            {jobs.length === 0 ? (
                <p>No pending jobs.</p>
            ) : (
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Company</th>
                            <th>Posted On</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id}>
                                <td>{job.title}</td>
                                <td>{job.postedBy?.companyName || 'N/A'}</td>
                                <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => approveJob(job.id)}>Approve</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
