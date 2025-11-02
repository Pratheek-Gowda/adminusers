const API_BASE = '/.netlify/functions';

async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();

        if (!data.success && data.error) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        showError(error.message);
        throw error;
    }
}

function showError(message) {
    alert('Error: ' + message);
}

function showSuccess(message) {
    alert('Success: ' + message);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getStatusBadge(status) {
    const badges = {
        'approved': '<span style="background: #d4edda; color: #155724; padding: 5px 10px; border-radius: 5px;">✓ Approved</span>',
        'rejected': '<span style="background: #f8d7da; color: #721c24; padding: 5px 10px; border-radius: 5px;">✗ Rejected</span>',
        'pending': '<span style="background: #fff3cd; color: #856404; padding: 5px 10px; border-radius: 5px;">⏳ Pending</span>',
        'active': '<span style="background: #d4edda; color: #155724; padding: 5px 10px; border-radius: 5px;">✓ Active</span>',
        'inactive': '<span style="background: #e2e3e5; color: #383d41; padding: 5px 10px; border-radius: 5px;">✗ Inactive</span>'
    };
    return badges[status] || status;
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.onclick = function() {
            this.parentElement.parentElement.style.display = 'none';
        };
    });

    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
});
