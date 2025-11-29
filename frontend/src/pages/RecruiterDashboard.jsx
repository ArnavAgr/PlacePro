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
      <h2>Recruiter Dashboard</h2>
      <nav className="dashboard-nav">
        <Link to="/recruiter/create-job">Create Job</Link>
        <Link to="/recruiter/jobs">Manage Job Postings</Link>
      </nav>
      <div className="dashboard-content">
        <p>Welcome to your dashboard! Use the links above to create and manage job postings.</p>
        <h4>Your Job Postings</h4>
        {jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          <ul>
            {jobs.map(job => (
              <li key={job.id}>
                <p>Title: {job.title}</p>
                <p>Status: {job.status}</p>
                <p>Applications: {job.applications.length}</p>
                <Link to={`/recruiter/jobs/${job.id}/applications`}>Manage Applications</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
