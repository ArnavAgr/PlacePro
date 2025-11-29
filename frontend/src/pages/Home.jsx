import React from 'react';
import { getRole } from '../services/auth';
import './Home.css';

export default function Home() {
  const role = getRole();

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to <span className="brand-name">PlacePro</span></h1>
        <p>Your one-stop solution for placement management</p>
      </header>

      <div className="home-content">
        {!role ? (
          <div className="home-guest">
            <h2>Hello, Guest!</h2>
            <p>
              Please <a href="/login" className="home-link">login</a> to access your dashboard.
            </p>
          </div>
        ) : (
          <div className="home-dashboard">
            <h2>Welcome, {role}!</h2>
            {role === 'STUDENT' && (
              <p>
                Explore <a href="/jobs" className="home-link">available jobs</a> and track your applications.
              </p>
            )}
            {role === 'RECRUITER' && (
              <p>
                Manage your <a href="/recruiter/create-job" className="home-link">job postings</a> and view applications.
              </p>
            )}
            {role === 'PLACEMENT_CELL' && (
              <p>
                Go to the <a href="/admin/create-user" className="home-link">admin panel</a> to manage users and approve jobs.
              </p>
            )}
          </div>
        )}
      </div>

      <footer className="home-footer">
        <p>Empowering placements, one step at a time.</p>
      </footer>
    </div>
  );
}
