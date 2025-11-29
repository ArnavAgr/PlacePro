import React, { useEffect, useState } from 'react';
import axios from '../services/auth';
import { useAlert } from '../context/AlertContext';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showAlert } = useAlert();

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const res = await axios.get('/reports/analytics');
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            showAlert('Failed to fetch analytics data', 'error');
            setLoading(false);
        }
    }

    if (loading) return <div className="dashboard-container">Loading analytics...</div>;
    if (!data) return null;

    // 1. Placement Status Chart Data
    const placementStatusData = {
        labels: ['Placed', 'Unplaced'],
        datasets: [
            {
                data: [data.placementStatus.placed, data.placementStatus.unplaced],
                backgroundColor: ['#10B981', '#EF4444'], // Green, Red
                borderColor: ['#059669', '#DC2626'],
                borderWidth: 1,
            },
        ],
    };

    // 2. Branch-wise Chart Data
    const branchLabels = data.branchStats.map(b => b.branch);
    const branchTotal = data.branchStats.map(b => b.total);
    const branchPlaced = data.branchStats.map(b => b.placed);

    const branchChartData = {
        labels: branchLabels,
        datasets: [
            {
                label: 'Total Students',
                data: branchTotal,
                backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
            {
                label: 'Placed Students',
                data: branchPlaced,
                backgroundColor: 'rgba(16, 185, 129, 0.5)', // Green
                borderColor: 'rgb(16, 185, 129)',
                borderWidth: 1,
            }
        ]
    };

    // 3. Top Jobs Chart Data
    const jobLabels = data.topJobs.map(j => j.title);
    const jobApps = data.topJobs.map(j => j.applications);

    const topJobsData = {
        labels: jobLabels,
        datasets: [
            {
                label: 'Applications',
                data: jobApps,
                backgroundColor: 'rgba(245, 158, 11, 0.5)', // Amber
                borderColor: 'rgb(245, 158, 11)',
                borderWidth: 1,
            }
        ]
    };

    return (
        <div className="dashboard-container">
            <h2 style={{ marginBottom: '24px', color: 'var(--primary)' }}>Placement Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

                {/* Placement Overview */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ marginBottom: '16px' }}>Overall Placement Status</h3>
                    <div style={{ width: '250px', height: '250px' }}>
                        <Doughnut data={placementStatusData} />
                    </div>
                    <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <p><strong>Total Students:</strong> {data.placementStatus.placed + data.placementStatus.unplaced}</p>
                        <p><strong>Placement Rate:</strong> {((data.placementStatus.placed / (data.placementStatus.placed + data.placementStatus.unplaced || 1)) * 100).toFixed(1)}%</p>
                    </div>
                </div>

                {/* Top Jobs */}
                <div className="card">
                    <h3 style={{ marginBottom: '16px' }}>Most Popular Jobs</h3>
                    <Bar
                        data={topJobsData}
                        options={{
                            responsive: true,
                            indexAxis: 'y', // Horizontal bar chart
                            plugins: { legend: { display: false } }
                        }}
                    />
                </div>

                {/* Branch-wise Stats */}
                <div className="card" style={{ gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '16px' }}>Branch-wise Performance</h3>
                    <Bar
                        data={branchChartData}
                        options={{
                            responsive: true,
                            scales: {
                                y: { beginAtZero: true }
                            }
                        }}
                    />
                </div>

            </div>
        </div>
    );
}
