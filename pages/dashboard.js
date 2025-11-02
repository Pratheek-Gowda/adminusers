import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminUser = typeof window !== 'undefined' ? localStorage.getItem('adminUser') : null;
    if (!adminUser) {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return;
    }
    
    setAdmin(JSON.parse(adminUser));
    loadData();
  }, []);

  async function loadData() {
    try {
      // Use local Vercel API endpoints (direct to database)
      const statsResponse = await fetch('/api/admin/dashboard-stats');
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
      
      const referralsResponse = await fetch('/api/admin/all-referrals');
      const referralsData = await referralsResponse.json();
      
      if (referralsData.success) {
        const usersMap = {};
        
        referralsData.allReferrals.forEach(referral => {
          const username = referral.referrer_username;
          
          if (!usersMap[username]) {
            usersMap[username] = {
              id: referral.user_id,
              username: username,
              email: referral.referrer_email,
              fullName: referral.referrer_name,
              total: 0,
              approved: 0,
              pending: 0,
              rejected: 0
            };
          }
          
          usersMap[username].total++;
          if (referral.status === 'approved') usersMap[username].approved++;
          else if (referral.status === 'pending') usersMap[username].pending++;
          else if (referral.status === 'rejected') usersMap[username].rejected++;
        });
        
        setUsers(Object.values(usersMap).sort((a, b) => b.total - a.total));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminUser');
      window.location.href = '/';
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
          font-size: 28px;
          margin: 0;
        }
        
        .header-right {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        
        .logout-btn {
          background: #dc3545;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        
        .logout-btn:hover {
          background: #c82333;
        }
        
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 30px 20px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        
        .stat-number {
          font-size: 48px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 10px;
        }
        
        .stat-label {
          color: #666;
          font-size: 14px;
          font-weight: 600;
        }
        
        .section-title {
          color: #333;
          margin-bottom: 20px;
          font-size: 22px;
          font-weight: 600;
        }
        
        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px;
          text-align: left;
          font-weight: 600;
        }
        
        td {
          padding: 15px;
          border-bottom: 1px solid #eee;
        }
        
        tr:hover {
          background: #f9f9f9;
        }
        
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .status-approved {
          background: #d4edda;
          color: #155724;
        }
        
        .status-pending {
          background: #fff3cd;
          color: #856404;
        }
        
        .status-rejected {
          background: #f8d7da;
          color: #721c24;
        }
      `}</style>
      
      <div className="header">
        <h1>📊 Admin Dashboard</h1>
        <div className="header-right">
          <div>👤 {admin?.username}</div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>
      
      <div className="container">
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalLinks}</div>
              <div className="stat-label">Referral Links</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalReferrals}</div>
              <div className="stat-label">Total Referrals</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: '#28a745' }}>
                {stats.statusBreakdown.approved || 0}
              </div>
              <div className="stat-label">✓ Approved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: '#ffc107' }}>
                {stats.statusBreakdown.pending || 0}
              </div>
              <div className="stat-label">⏳ Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: '#dc3545' }}>
                {stats.statusBreakdown.rejected || 0}
              </div>
              <div className="stat-label">✗ Rejected</div>
            </div>
          </div>
        )}
        
        <h2 className="section-title">👥 User Performance Analytics</h2>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Full Name</th>
                <th>Total</th>
                <th>Approved</th>
                <th>Pending</th>
                <th>Rejected</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td><strong>@{user.username}</strong></td>
                    <td>{user.email}</td>
                    <td>{user.fullName}</td>
                    <td><strong>{user.total}</strong></td>
                    <td><span className="status-badge status-approved">✓ {user.approved}</span></td>
                    <td><span className="status-badge status-pending">⏳ {user.pending}</span></td>
                    <td><span className="status-badge status-rejected">✗ {user.rejected}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
