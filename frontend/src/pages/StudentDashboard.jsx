import React, { useEffect, useState } from 'react';
import axios from '../services/auth';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { useAlert } from '../context/AlertContext';

export default function StudentDashboard() {
  const [applications, setApplications] = useState([]);
  const [resume, setResume] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const { showAlert } = useAlert();

  // Edit Profile Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ cgpa: '', skills: '' });

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
        showAlert('Failed to fetch data', 'error');
      }
    }
    fetchData();
  }, []);

  async function uploadResume(e) {
    e.preventDefault();
    if (!resume) return showAlert('Please select a file', 'warning');

    const formData = new FormData();
    formData.append('resume', resume);
    try {
      const res = await axios.post('/students/upload-resume', formData);
      showAlert('Resume uploaded successfully', 'success');
      setStudentProfile(prev => ({ ...prev, resumeFilePath: res.data.filePath }));
    } catch (err) {
      console.error(err);
      showAlert('Failed to upload resume', 'error');
    }
  }

  function openEditModal() {
    setEditForm({
      cgpa: studentProfile?.cgpa || '',
      skills: studentProfile?.skills || ''
    });
    setShowEditModal(true);
  }

  async function submitEditProfile(e) {
    e.preventDefault();
    try {
      await axios.put('/students/profile', { cgpa: editForm.cgpa, skills: editForm.skills });
      showAlert('Profile updated successfully', 'success');
      setShowEditModal(false);
      // Refresh profile
      const res = await axios.get('/students/profile');
      setStudentProfile(res.data);
    } catch (err) {
      console.error(err);
      showAlert('Failed to update profile: ' + (err.response?.data?.error || err.message), 'error');
    }
  }

  async function respondToOffer(offerId, status) {
    try {
      await axios.put(`/offers/${offerId}/respond`, { status });
      showAlert(`Offer ${status.toLowerCase()} successfully`, 'success');
      setTimeout(() => window.location.reload(), 1500); // Reload after delay
    } catch (err) {
      console.error(err);
      showAlert('Failed to respond to offer', 'error');
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
            <button className="btn btn-primary" onClick={openEditModal}>Edit Profile</button>
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', padding: '24px' }}>
            <h3 style={{ marginTop: 0 }}>Edit Profile</h3>
            <form onSubmit={submitEditProfile}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.cgpa}
                  onChange={e => setEditForm({ ...editForm, cgpa: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px' }}>Skills (comma separated)</label>
                <textarea
                  value={editForm.skills}
                  onChange={e => setEditForm({ ...editForm, skills: e.target.value })}
                  style={{ width: '100%', minHeight: '80px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
