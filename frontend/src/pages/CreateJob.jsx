import React, { useState } from 'react';
import axios from '../services/auth';
import { useAlert } from '../context/AlertContext';

export default function CreateJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [deadline, setDeadline] = useState('');
  const { showAlert } = useAlert();

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post('/jobs', { title, description, eligibility, deadline });
      showAlert('Job created successfully', 'success');
    } catch (err) {
      console.error(err);
      showAlert('Failed to create job', 'error');
    }
  }

  return (
    <div>
      <h3>Create Job</h3>
      <form onSubmit={submit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input placeholder="Eligibility" value={eligibility} onChange={e => setEligibility(e.target.value)} />
        <div style={{ textAlign: 'left', marginBottom: '8px', color: '#666' }}>Application Deadline</div>
        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
        <button type="submit">Create Job</button>
      </form>
    </div>
  );
}
