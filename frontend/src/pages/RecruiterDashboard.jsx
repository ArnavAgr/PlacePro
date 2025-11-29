import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/auth';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await axios.get('/jobs/my-jobs');
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch jobs');
      }
    }
    fetchJobs();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Recruiter Dashboard</h2>

      <div className="card" style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          Welcome to your dashboard! Use the sidebar to create new job postings or manage existing ones.
        </p>
      </div>

      <h3 style={{ marginBottom: '16px' }}>Your Job Postings</h3>
      <div className="card">
        {jobs.length === 0 ? (
          <p>No jobs found. <Link to="/recruiter/create-job" style={{ color: 'var(--primary)' }}>Post a job now</Link>.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Applications</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td><strong>{job.title}</strong></td>
                  <td>
                    <span className={`badge ${job.status === 'ACTIVE' ? 'success' :
                        job.status === 'CLOSED' ? 'danger' : 'warning'
                      }`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <span className="badge info">{job.applications.length} Applicants</span>
                  </td>
                  <td>
                    <Link to={`/recruiter/jobs/${job.id}/applications`} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>
                      Manage Applications
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
