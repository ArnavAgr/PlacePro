import React from 'react';
import { Link } from 'react-router-dom';
import { getRole } from '../services/auth';

export default function Home() {
  const role = getRole();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--secondary) 0%, #0F172A 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px' }}>
        <img src="/src/assets/logo.png" alt="PlacePro Logo" style={{ height: '80px', marginBottom: '24px' }} />
        <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', fontWeight: '800', letterSpacing: '-0.02em' }}>
          Welcome to <span style={{ color: 'var(--primary)' }}>PlacePro</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94A3B8', marginBottom: '48px', lineHeight: '1.6' }}>
          Streamline your campus placement process. Connect students, recruiters, and placement cells in one unified platform.
        </p>

        {!role ? (
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1.1rem', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/sign-up" className="btn btn-outline" style={{ padding: '12px 32px', fontSize: '1.1rem', textDecoration: 'none', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
            <h2 style={{ marginTop: 0 }}>Welcome back, {role}!</h2>
            <p style={{ color: '#CBD5E1', marginBottom: '24px' }}>You are already logged in.</p>

            {role === 'STUDENT' && (
              <Link to="/student/dashboard" className="btn btn-primary" style={{ textDecoration: 'none' }}>Go to Dashboard</Link>
            )}
            {role === 'RECRUITER' && (
              <Link to="/recruiter/dashboard" className="btn btn-primary" style={{ textDecoration: 'none' }}>Go to Dashboard</Link>
            )}
            {role === 'PLACEMENT_CELL' && (
              <Link to="/placement-cell/dashboard" className="btn btn-primary" style={{ textDecoration: 'none' }}>Go to Dashboard</Link>
            )}
          </div>
        )}
      </div>

      <footer style={{ position: 'absolute', bottom: '20px', color: '#64748B', fontSize: '0.875rem' }}>
        &copy; 2025 PlacePro. Empowering careers.
      </footer>
    </div>
  );
}
