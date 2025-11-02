let allApprovals = [];

async function loadApprovals() {
    try {
        const data = await apiCall('/get-approval-history');
        
        if (data.success && data.history) {
            // Get pending referrals
            const referralsData = await apiCall('/get-user-referrals');
            allApprovals = data.history;
            displayApprovals(allApprovals);
        }
    } catch (error) {
        console.error('Failed to load approvals:', error);
    }
}

function displayApprovals(approvals) {
    const tbody = document.getElementById('approvalsTable');
    tbody.innerHTML = '';

    if (approvals.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No referrals found</td></tr>';
        return;
    }

    approvals.forEach(approval => {
        const row = `
            <tr>
                <td>${approval.id}</td>
                <td>${approval.referred_name}</td>
                <td>${approval.referred_email}</td>
                <td>${approval.referred_phone || 'N/A'}</td>
                <td>${getStatusBadge(approval.status)}</td>
                <td>${formatDate(approval.created_at)}</td>
                <td>
                    ${approval.status === 'pending' ? `<button class="btn-primary" onclick="openApprovalModal(${approval.id})">Review</button>` : '-'}
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function openApprovalModal(referralId) {
    document.getElementById('approvalReferralId').value = referralId;
    openModal('approvalModal');
}

async function submitApproval(event) {
    event.preventDefault();

    const referralId = document.getElementById('approvalReferralId').value;
    const status = document.getElementById('approvalStatus').value;
    const adminNotes = document.getElementById('approvalNotes').value;

    if (!status) {
        showError('Please select a status');
        return;
    }

    try {
        const admin = JSON.parse(localStorage.getItem('adminUser'));
        const data = await apiCall('/approve-referral', 'POST', {
            referralId,
            status,
            adminNotes,
            approvedBy: admin.username
        });

        if (data.success) {
            showSuccess(`Referral ${status} successfully`);
            closeModal('approvalModal');
            loadApprovals();
        }
    } catch (error) {
        console.error('Failed to approve referral:', error);
    }
}

document.getElementById('statusFilter').addEventListener('change', (e) => {
    const status = e.target.value;
    const filtered = status ? allApprovals.filter(a => a.status === status) : allApprovals;
    displayApprovals(filtered);
});

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadApprovals();
});
