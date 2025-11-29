import React from 'react';
import Sidebar from './Sidebar';
import { getRole } from '../services/auth';

export default function Layout({ children }) {
    const role = getRole();

    if (!role) {
        return <>{children}</>; // No sidebar for unauthenticated users
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar role={role} />
            <main style={{
                flex: 1,
                marginLeft: '260px',
                padding: '32px',
                minHeight: '100vh',
                // backgroundColor: 'var(--background)' // Removed to show body pattern
            }}>
                {children}
            </main>
        </div>
    );
}
