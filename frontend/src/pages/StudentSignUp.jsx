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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // background: 'var(--background)', // Removed to show body pattern
      padding: '20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/src/assets/logo.png" alt="PlacePro Logo" style={{ height: '60px' }} />
        </div>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '32px', marginTop: 0 }}>Create Student Account</h2>

        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Roll Number</label>
              <input placeholder="102003000" value={rollNo} onChange={(e) => setRollNo(e.target.value)} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Branch</label>
              <input placeholder="CSE" value={branch} onChange={(e) => setBranch(e.target.value)} required />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Email Address</label>
            <input placeholder="name@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Password</label>
            <input placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.875rem' }}>Current CGPA</label>
            <input placeholder="9.5" type="number" step="0.01" value={cgpa} onChange={(e) => setCgpa(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Account</button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Login</a>
        </p>
      </div>
    </div>
  );
}
