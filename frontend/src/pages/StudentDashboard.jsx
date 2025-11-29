import React, { useEffect, useState } from 'react';
import axios from '../services/auth';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export default function StudentDashboard() {
  const [applications, setApplications] = useState([]);
  const [resume, setResume] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [appRes, profileRes] = await Promise.all([
          axios.get('/applications'),
          axios.get('/students/profile')
        ]);
        setApplications(appRes.data);
        setStudentProfile(profileRes.data);
      } catch (err) {
        console.error(err);
        // alert('Failed to fetch data');
      }
    }
    fetchData();
  }, []);

  async function uploadResume(e) {
    e.preventDefault();
    if (!resume) return alert('Please select a file');

    const formData = new FormData();
    formData.append('resume', resume);
    try {
      const res = await axios.post('/students/upload-resume', formData);
      alert('Resume uploaded successfully');
      setStudentProfile(prev => ({ ...prev, resumeFilePath: res.data.filePath }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload resume');
    }
  }

  async function updateProfile(cgpa, skills) {
    try {
      await axios.put('/students/profile', { cgpa, skills });
      alert('Profile updated successfully');
      // Refresh profile
      const res = await axios.get('/students/profile');
      setStudentProfile(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  }

  return (
    <div className="dashboard-container">
      <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Student Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Profile Card */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Profile Details</h3>
          <div className="profile-info">
            <p><strong>Roll No:</strong> {studentProfile?.rollNo || 'N/A'}</p>
            <p><strong>Branch:</strong> {studentProfile?.branch || 'N/A'}</p>
            <p><strong>CGPA:</strong> {studentProfile?.cgpa || 'N/A'}</p>
            <p><strong>Skills:</strong> {studentProfile?.skills || 'N/A'}</p>
            <button className="btn btn-primary" onClick={() => {
              const newCgpa = prompt('Enter new CGPA:', studentProfile?.cgpa || '');
              const newSkills = prompt('Enter skills (comma separated):', studentProfile?.skills || '');
              if (newCgpa !== null && newSkills !== null) updateProfile(newCgpa, newSkills);
            }}>Edit Profile</button>
          </div>
        </div>

        {/* Resume Card */}
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Resume</h3>
          {studentProfile?.resumeFilePath ? (
            <div className="badge success" style={{ display: 'inline-block', marginBottom: '16px' }}>
              ✅ Resume Uploaded
            </div>
          ) : (
            <div className="badge warning" style={{ display: 'inline-block', marginBottom: '16px' }}>
              ⚠️ No resume uploaded
            </div>
          )}

          {studentProfile?.resumeFilePath && (
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Path: {studentProfile.resumeFilePath}
            </p>
          )}

          <form onSubmit={uploadResume} className="upload-form">
            <input
              type="file"
              accept=".pdf"
              onChange={e => setResume(e.target.files[0])}
            />
            <button type="submit" className="btn btn-outline">Upload / Replace Resume</button>
          </form>
        </div>
      </div>

      {/* Applications Section */}
      <h3 style={{ marginTop: '32px' }}>Your Applications</h3>
      <div className="card">
        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>{app.job.title}</td>
                  <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${app.status === 'ACCEPTED' ? 'success' :
                        app.status === 'REJECTED' ? 'danger' :
                          app.status === 'OFFERED' ? 'info' : 'warning'
                      }`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    {app.status === 'OFFERED' && app.offer && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => respondToOffer(app.offer.id, 'ACCEPTED')}>Accept</button>
                        <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => respondToOffer(app.offer.id, 'REJECTED')}>Reject</button>
                      </div>
                    )}
                    {app.status === 'ACCEPTED' && <span>🎉 Offer Accepted</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

async function respondToOffer(offerId, status) {
  try {
    await axios.put(`/offers/${offerId}/respond`, { status });
    alert(`Offer ${status.toLowerCase()} successfully`);
    window.location.reload(); // Simple reload to refresh state
  } catch (err) {
    console.error(err);
    alert('Failed to respond to offer');
  }
}
