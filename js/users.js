let allUsers = [];

async function loadUsers() {
    try {
        const data = await apiCall('/get-all-users');
        
        if (data.success && data.users) {
            allUsers = data.users;
            displayUsers(allUsers);
        }
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = '';

    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No users found</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.full_name}</td>
                <td>${user.phone || 'N/A'}</td>
                <td>${getStatusBadge(user.status)}</td>
                <td>
                    <button class="btn-primary" onclick="editUser(${user.id})">Edit</button>
                    <button class="btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function editUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editFullName').value = user.full_name;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPhone').value = user.phone || '';
        document.getElementById('editStatus').value = user.status || 'active';
        openModal('editModal');
    }
}

async function saveUserChanges(event) {
    event.preventDefault();

    const userId = document.getElementById('editUserId').value;
    const fullName = document.getElementById('editFullName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const status = document.getElementById('editStatus').value;

    try {
        const data = await apiCall('/update-user', 'POST', {
            userId,
            fullName,
            email,
            phone,
            status
        });

        if (data.success) {
            showSuccess('User updated successfully');
            closeModal('editModal');
            loadUsers();
        }
    } catch (error) {
        console.error('Failed to update user:', error);
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const data = await apiCall('/delete-user', 'POST', { userId });

        if (data.success) {
            showSuccess('User deleted successfully');
            loadUsers();
        }
    } catch (error) {
        console.error('Failed to delete user:', error);
    }
}

document.getElementById('searchUsers').addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allUsers.filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.full_name.toLowerCase().includes(searchTerm)
    );
    displayUsers(filtered);
});

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUsers();
});
