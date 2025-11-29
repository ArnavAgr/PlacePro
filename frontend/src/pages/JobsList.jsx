import React, { useEffect, useState } from 'react';
import axios from '../services/auth';
import { useAlert } from '../context/AlertContext';

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const { showAlert } = useAlert();

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          axios.get('/jobs'),
          axios.get('/applications')
        ]);
        setJobs(jobsRes.data);
        const appliedIds = new Set(appsRes.data.map(app => app.jobId));
        setAppliedJobIds(appliedIds);
      } catch (err) {
        console.error(err);
        showAlert('Failed to fetch data', 'error');
      }
    }
    fetchData();
  }, []);

  async function applyToJob(jobId) {
    try {
      await axios.post(`/applications/apply`, { jobId });
      showAlert('Successfully applied to the job!', 'success');
      setAppliedJobIds(prev => new Set(prev).add(jobId)); // Update local state
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.error || 'Failed to apply to job', 'error');
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
              {appliedJobIds.has(job.id) ? (
                <button disabled style={{ backgroundColor: '#ccc', cursor: 'not-allowed' }}>Already Applied</button>
              ) : (
                <button onClick={() => applyToJob(job.id)}>Apply</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
