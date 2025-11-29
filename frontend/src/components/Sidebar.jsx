import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from '../services/auth';
import './Sidebar.css';

export default function Sidebar({ role }) {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <img src="/src/assets/logo.png" alt="PlacePro Logo" style={{ height: '40px', marginBottom: '8px' }} />
                <h2>PlacePro</h2>
                <span className="role-badge">{role}</span>
            </div>

            <nav className="sidebar-nav">
                {role === 'STUDENT' && (
                    <>
                        <Link to="/student/dashboard" className={isActive('/student/dashboard') ? 'active' : ''}>Dashboard</Link>
                        <Link to="/jobs" className={isActive('/jobs') ? 'active' : ''}>Jobs</Link>
                    </>
                )}

                {role === 'RECRUITER' && (
                    <>
                        <Link to="/recruiter/dashboard" className={isActive('/recruiter/dashboard') ? 'active' : ''}>Dashboard</Link>
                        <Link to="/recruiter/create-job" className={isActive('/recruiter/create-job') ? 'active' : ''}>Post Job</Link>
                    </>
                )}

                {role === 'PLACEMENT_CELL' && (
                    <>
                        <Link to="/placement-cell/dashboard" className={isActive('/placement-cell/dashboard') ? 'active' : ''}>Dashboard</Link>
                        <Link to="/admin/approve-jobs" className={isActive('/admin/approve-jobs') ? 'active' : ''}>Approve Jobs</Link>
                        <Link to="/admin/create-user" className={isActive('/admin/create-user') ? 'active' : ''}>Manage Users</Link>
                        <Link to="/admin/analytics" className={isActive('/admin/analytics') ? 'active' : ''}>Analytics</Link>
                    </>
                )}
            </nav>

            <div className="sidebar-footer">
                <button onClick={() => { logout(); window.location.href = '/'; }} className="btn-logout">
                    Logout
                </button>
            </div>
        </aside>
    );
}
