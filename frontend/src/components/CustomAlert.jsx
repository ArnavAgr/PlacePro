import React from 'react';
import { useAlert } from '../context/AlertContext';

export default function CustomAlert() {
    const { alert, closeAlert } = useAlert();

    if (!alert) return null;

    const isConfirm = !!alert.onConfirm;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{
                width: '90%',
                maxWidth: '400px',
                padding: '32px',
                textAlign: 'center',
                animation: 'fadeIn 0.2s ease-out'
            }}>
                <h3 style={{
                    marginTop: 0,
                    marginBottom: '16px',
                    color: alert.type === 'error' ? '#EF4444' : 'var(--primary)'
                }}>
                    {alert.type === 'error' ? 'Error' : 'Notice'}
                </h3>

                <p style={{ marginBottom: '24px', fontSize: '1rem', lineHeight: '1.5' }}>
                    {alert.message}
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    {isConfirm ? (
                        <>
                            <button
                                className="btn btn-outline"
                                onClick={closeAlert}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    alert.onConfirm();
                                    closeAlert();
                                }}
                            >
                                Confirm
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={closeAlert}
                            style={{ minWidth: '100px' }}
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
