import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/auth';

import { getRole } from '../services/auth';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const role = getRole();

  useEffect(() => {
    async function fetchData() {
      try {
        const jobRes = await axios.get(`/jobs/${id}`);
        setJob(jobRes.data);

        if (role === 'STUDENT') {
          const appsRes = await axios.get('/applications');
          const applied = appsRes.data.some(app => app.jobId === id);
          setHasApplied(applied);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to fetch job details');
      }
    }
    fetchData();
  }, [id, role]);

  async function applyToJob() {
    try {
      await axios.post('/applications/apply', { jobId: id });
      alert('Applied successfully');
      setHasApplied(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to apply');
    }
  }

  if (!job) return <p>Loading...</p>;

  return (
    <div className="job-details-container">
      <h3>{job.title}</h3>
      <p>{job.description}</p>
      <p><strong>Eligibility:</strong> {job.eligibility}</p>
      <p><strong>Deadline:</strong> {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</p>

      {role === 'STUDENT' && (
        hasApplied ? (
          <button disabled className="apply-btn" style={{ backgroundColor: '#ccc', cursor: 'not-allowed' }}>Already Applied</button>
        ) : (
          <button onClick={applyToJob} className="apply-btn">Apply Now</button>
        )
      )}
    </div>
  );
}
