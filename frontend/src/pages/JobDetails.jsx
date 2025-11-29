import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/auth';

import { getRole } from '../services/auth';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const role = getRole();

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await axios.get(`/jobs/${id}`); // Adjusted to match axios baseURL
        setJob(res.data);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch job details');
      }
    }
    fetchJob();
  }, [id]);

  async function applyToJob() {
    try {
      await axios.post('/applications/apply', { jobId: id });
      alert('Applied successfully');
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
        <button onClick={applyToJob} className="apply-btn">Apply Now</button>
      )}
    </div>
  );
}
