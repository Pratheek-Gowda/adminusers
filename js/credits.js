let allUsers = [];

async function loadCredits() {
    try {
        const data = await apiCall('/get-credits');
        
        if (data.success && data.credits) {
            displayCredits(data.credits);
        }
    } catch (error) {
        console.error('Failed to load credits:', error);
    }
}

function displayCredits(credits) {
    const tbody = document.getElementById('creditsTable');
    tbody.innerHTML = '';

    if (credits.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No credits found</td></tr>';
        return;
    }

    credits.forEach(credit => {
        const row = `
            <tr>
                <td>${credit.username}</td>
                <td>₹${credit.amount}</td>
                <td>${getStatusBadge(credit.status)}</td>
                <td>${formatDate(credit.created_at)}</td>
                <td>${credit.reason || 'N/A'}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function loadUsersForDropdown() {
    try {
        const data = await apiCall('/get-all-users');
        
        if (data.success && data.users) {
            allUsers = data.users;
            const select = document.getElementById('creditUser');
            select.innerHTML = '<option value="">Select User</option>';
            
            data.users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.username} (${user.full_name})`;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

function openAddCreditModal() {
    document.getElementById('creditAmount').value = '';
    document.getElementById('creditReason').value = '';
    document.getElementById('creditNotes').value = '';
    openModal('creditModal');
}

async function submitCredit(event) {
    event.preventDefault();

    const userId = document.getElementById('creditUser').value;
    const amount = document.getElementById('creditAmount').value;
    const reason = document.getElementById('creditReason').value;
    const notes = document.getElementById('creditNotes').value;

    if (!userId || !amount) {
        showError('Please fill all required fields');
        return;
    }

    try {
        const admin = JSON.parse(localStorage.getItem('adminUser'));
        const data = await apiCall('/add-credit', 'POST', {
            userId,
            amount: parseFloat(amount),
            reason,
            adminNotes: notes,
            adminId: admin.id
        });

        if (data.success) {
            showSuccess('Credit added successfully');
            closeModal('creditModal');
            loadCredits();
        }
    } catch (error) {
        console.error('Failed to add credit:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadCredits();
    loadUsersForDropdown();
});
