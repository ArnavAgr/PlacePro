import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/auth';

export default function ManageApplications() {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, [jobId]);

    async function fetchApplications() {
        try {
            const res = await axios.get(`/applications/job/${jobId}`);
            setApplications(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch applications');
            setLoading(false);
        }
    }

    const [showOfferModal, setShowOfferModal] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [offerForm, setOfferForm] = useState({ role: '', salary: '', notes: '' });

    async function updateStatus(appId, status, extraData = {}) {
        try {
            await axios.patch(`/applications/${appId}/status`, { status, ...extraData });
            alert(`Status updated to ${status}`);
            fetchApplications(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    }

    async function scheduleInterview(appId) {
        const date = prompt('Enter interview date (YYYY-MM-DD):');
        if (!date) return;
        updateStatus(appId, 'INTERVIEW_SCHEDULED', { interviewDate: date });
    }

    function openOfferModal(appId) {
        setSelectedAppId(appId);
        setOfferForm({ role: '', salary: '', notes: '' });
        setShowOfferModal(true);
    }

    async function submitOffer(e) {
        e.preventDefault();
        if (!selectedAppId) return;

        const details = JSON.stringify(offerForm);

        try {
            await axios.post('/offers/create', { appId: selectedAppId, details });
            alert('Offer created successfully');
            setShowOfferModal(false);
            fetchApplications();
        } catch (err) {
            console.error(err);
            alert('Failed to create offer');
        }
    }

    if (loading) return <p>Loading applicants...</p>;

    return (
        <div className="manage-apps-container">
            <h2>Manage Applications</h2>
            {applications.length === 0 ? (
                <p>No applications yet.</p>
            ) : (
                <table className="apps-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Status</th>
                            <th>Resume</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map(app => (
                            <tr key={app.id}>
                                <td>{app.student.user.email}</td>
                                <td>{app.status}</td>
                                <td>
                                    {app.resumeFilePath && (
                                        <a href={`http://localhost:4000/${app.resumeFilePath.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer">
                                            View Resume
                                        </a>
                                    )}
                                </td>
                                <td>
                                    {app.status === 'APPLIED' && (
                                        <>
                                            <button onClick={() => updateStatus(app.id, 'SHORTLISTED')}>Shortlist</button>
                                            <button onClick={() => updateStatus(app.id, 'REJECTED')}>Reject</button>
                                        </>
                                    )}
                                    {app.status === 'SHORTLISTED' && (
                                        <button onClick={() => scheduleInterview(app.id)}>Schedule Interview</button>
                                    )}
                                    {app.status === 'INTERVIEW_SCHEDULED' && (
                                        <button onClick={() => openOfferModal(app.id)}>Create Offer</button>
                                    )}
                                    {app.status === 'OFFERED' && <span>Offer Sent</span>}
                                    {app.status === 'ACCEPTED' && <span>Placed</span>}
                                    {app.status === 'REJECTED' && <span>Rejected</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showOfferModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '400px', padding: '24px' }}>
                        <h3>Create Offer</h3>
                        <form onSubmit={submitOffer}>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '4px' }}>Job Role</label>
                                <input
                                    required
                                    value={offerForm.role}
                                    onChange={e => setOfferForm({ ...offerForm, role: e.target.value })}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '4px' }}>Salary (CTC)</label>
                                <input
                                    required
                                    value={offerForm.salary}
                                    onChange={e => setOfferForm({ ...offerForm, salary: e.target.value })}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px' }}>Additional Details</label>
                                <textarea
                                    value={offerForm.notes}
                                    onChange={e => setOfferForm({ ...offerForm, notes: e.target.value })}
                                    style={{ width: '100%', minHeight: '80px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setShowOfferModal(false)} className="btn btn-outline">Cancel</button>
                                <button type="submit" className="btn btn-primary">Send Offer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
