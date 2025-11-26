const API_BASE = window.API_BASE || '';

async function loadAnalytics() {
    const contentDiv = document.getElementById('dashboardContent');
    
    try {
        const response = await fetch(`${API_BASE}/api/analytics`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const events = await response.json();
        
        if (!Array.isArray(events)) {
            throw new Error('Invalid analytics data format');
        }

        renderDashboard(events);
        
    } catch (error) {
        console.error('Failed to load analytics:', error);
        contentDiv.innerHTML = `
            <div class="error-message">
                <strong>Analytics not available:</strong> ${error.message}
            </div>
            <div class="info-message">
                Make sure the backend server is running and accessible at <code>${API_BASE || 'same-origin'}/api/analytics</code>
            </div>
        `;
    }
}

function renderDashboard(events) {
    const contentDiv = document.getElementById('dashboardContent');
    
    if (events.length === 0) {
        contentDiv.innerHTML = `
            <div class="info-message">
                No analytics events recorded yet. Start interacting with the product page to generate data.
            </div>
            <div class="chart-container">
                <div class="chart-title">Events by Type</div>
                <canvas id="eventsChart"></canvas>
            </div>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Events</div>
                    <div class="stat-value">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Unique Event Types</div>
                    <div class="stat-value">0</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Most Common Event</div>
                    <div class="stat-value" style="font-size: 18px;">N/A</div>
                </div>
            </div>
        `;
        
        // Render empty chart with zeros
        const ctx = document.getElementById('eventsChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['No Data'],
                    datasets: [{
                        label: 'Event Count',
                        data: [0],
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
        return;
    }

    // Count events by type
    const eventCounts = {};
    events.forEach(event => {
        const eventType = event.event || 'unknown';
        eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
    });

    // Build dashboard HTML
    contentDiv.innerHTML = `
        <div class="chart-container">
            <div class="chart-title">Events by Type</div>
            <canvas id="eventsChart"></canvas>
        </div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Events</div>
                <div class="stat-value">${events.length}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Unique Event Types</div>
                <div class="stat-value">${Object.keys(eventCounts).length}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Most Common Event</div>
                <div class="stat-value" style="font-size: 18px;">${Object.keys(eventCounts).sort((a,b) => eventCounts[b] - eventCounts[a])[0] || 'N/A'}</div>
            </div>
        </div>
    `;

    // Render chart with data
    const ctx = document.getElementById('eventsChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(eventCounts),
                datasets: [{
                    label: 'Event Count',
                    data: Object.values(eventCounts),
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', loadAnalytics);

