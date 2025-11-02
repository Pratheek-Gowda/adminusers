async function loadDashboardStats() {
    try {
        const data = await apiCall('/get-dashboard-stats');
        
        if (data.success && data.stats) {
            document.getElementById('totalUsers').textContent = data.stats.totalUsers;
            document.getElementById('totalLinks').textContent = data.stats.totalLinks;
            document.getElementById('totalReferrals').textContent = data.stats.totalReferrals;
            document.getElementById('approvedCount').textContent = data.stats.approvedReferrals;
            document.getElementById('pendingCount').textContent = data.stats.pendingReferrals;
            document.getElementById('rejectedCount').textContent = data.stats.rejectedReferrals;
            document.getElementById('totalCredits').textContent = data.stats.totalCredits;
        }
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboardStats();
    setInterval(loadDashboardStats, 30000); // Refresh every 30 seconds
});

