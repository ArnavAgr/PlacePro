import React, { useState } from 'react';
import axios from '../services/auth';

export default function CreateJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [deadline, setDeadline] = useState('');

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post('/jobs', { title, description, eligibility, deadline });
      alert('Job created successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to create job');
    }
  }

  return (
    <div>
      <h3>Create Job</h3>
      <form onSubmit={submit}>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input placeholder="Eligibility" value={eligibility} onChange={e => setEligibility(e.target.value)} />
        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
        <button type="submit">Create Job</button>
      </form>
    </div>
  );
}
