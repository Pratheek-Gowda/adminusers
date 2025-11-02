let allHistory = [];

async function loadHistory() {
    try {
        const data = await apiCall('/get-approval-history');
        
        if (data.success && data.history) {
            allHistory = data.history;
            displayHistory(allHistory);
        }
    } catch (error) {
        console.error('Failed to load history:', error);
    }
}

function displayHistory(history) {
    const timeline = document.getElementById('historyTimeline');
    timeline.innerHTML = '';

    if (history.length === 0) {
        timeline.innerHTML = '<div style="text-align: center; padding: 20px;">No history found</div>';
        return;
    }

    history.forEach(item => {
        const statusClass = item.status === 'approved' ? 'approved' : 'rejected';
        const item_html = `
            <div class="timeline-item" style="border-left-color: ${item.status === 'approved' ? '#28a745' : '#dc3545'}">
                <div style="display: flex; justify-content: space-between;">
                    <strong>${item.referred_name}</strong>
                    <span style="color: #999; font-size: 12px;">${formatDate(item.approved_at)}</span>
                </div>
                <p style="margin: 10px 0; color: #666;">Email: ${item.referred_email}</p>
                <p>${getStatusBadge(item.status)}</p>
                ${item.admin_notes ? `<p style="margin-top: 10px; padding: 10px; background: #f9f9f9; border-radius: 5px;"><strong>Notes:</strong> ${item.admin_notes}</p>` : ''}
                <p style="margin-top: 10px; font-size: 12px; color: #999;">Referrer: ${item.referrer_name}</p>
            </div>
        `;
        timeline.innerHTML += item_html;
    });
}

document.getElementById('historySearch').addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allHistory.filter(item => 
        item.referred_name.toLowerCase().includes(searchTerm) ||
        item.referred_email.toLowerCase().includes(searchTerm) ||
        item.referrer_name.toLowerCase().includes(searchTerm)
    );
    displayHistory(filtered);
});

document.getElementById('historyFilter').addEventListener('change', (e) => {
    const status = e.target.value;
    const filtered = status ? allHistory.filter(h => h.status === status) : allHistory;
    displayHistory(filtered);
});

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadHistory();
});
