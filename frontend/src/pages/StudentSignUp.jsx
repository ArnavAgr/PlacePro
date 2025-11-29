import React, { useState } from 'react';
import axios from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function StudentSignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [branch, setBranch] = useState('');
  const [cgpa, setCgpa] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post('/students/sign-up', { email, password, rollNo, branch, cgpa });
      alert('Sign-up successful! You can now log in.');
      nav('/login');
    } catch (err) {
      console.error(err);
      alert('Sign-up failed: ' + (err.response?.data?.error || err.message));
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h3>Student Sign-Up</h3>
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input placeholder="Roll Number" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
        <input placeholder="Branch" value={branch} onChange={(e) => setBranch(e.target.value)} />
        <input placeholder="CGPA" type="number" step="0.01" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
