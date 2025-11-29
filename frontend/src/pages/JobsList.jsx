import React, { useEffect, useState } from 'react';
import axios from '../services/auth';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await axios.get('/jobs'); // Updated to match backend route
        setJobs(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch jobs');
      }
    }
    fetchJobs();
  }, []);

  async function applyToJob(jobId) {
    try {
      await axios.post(`/applications/apply`, { jobId });
      alert('Successfully applied to the job!');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to apply to job');
    }
  }

  return (
    <div>
      <h3>Available Jobs</h3>
      {jobs.length === 0 ? (
        <p>No jobs available</p>
      ) : (
        <ul>
          {jobs.map(job => (
            <li key={job.id}>
              <h4>{job.title}</h4>
              <p>{job.description}</p>
              <p>Eligibility: {job.eligibility || 'N/A'}</p>
              <p>Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</p>
              <button onClick={() => applyToJob(job.id)}>Apply</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
