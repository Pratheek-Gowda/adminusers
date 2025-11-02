
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (!adminUser) {
      router.push('/');
      return;
    }
    setAdmin(JSON.parse(adminUser));
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const statsRes = await fetch('/api/admin/dashboard-stats');
      const statsData = await statsRes.json();
      if (statsData.success) setStats(statsData.stats);

      const usersRes = await fetch('/api/admin/all-referrals');
      const usersData = await usersRes.json();

      if (usersData.success) {
        const userMap = {};
        usersData.allReferrals.forEach((ref) => {
          const username = ref.referrer_username;
          if (!userMap[username]) {
            userMap[username] = {
              id: ref.user_id,
              username,
              email: ref.referrer_email,
              fullName: ref.referrer_name,
              total: 0,
              approved: 0,
              pending: 0,
              rejected: 0
            };
          }
          userMap[username].total++;
          if (ref.status === 'approved') userMap[username].approved++;
          if (ref.status === 'pending') userMap[username].pending++;
          if (ref.status === 'rejected') userMap[username].rejected++;
        });
        setUsers(Object.values(userMap).sort((a, b) => b.total - a.total));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    router.push('/');
  };

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ fontFamily: 'Arial', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>📊 Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span>👤 {admin?.username}</span>
          <button onClick={logout} style={{ background: '#dc3545', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>{stats.totalUsers}</div>
              <div style={{ color: '#666' }}>Total Users</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>{stats.totalLinks}</div>
              <div style={{ color: '#666' }}>Referral Links</div>
            </div>
            <div style={{ background: 'white', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#667eea' }}>{stats.totalReferrals}</div>
              <div style={{ color: '#666' }}>Total Referrals</div>
            </div>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#667eea', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Username</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Total</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Approved</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Pending</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Rejected</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>@{user.username}</td>
                  <td style={{ padding: '15px' }}>{user.email}</td>
                  <td style={{ padding: '15px' }}><strong>{user.total}</strong></td>
                  <td style={{ padding: '15px' }}>✓ {user.approved}</td>
                  <td style={{ padding: '15px' }}>⏳ {user.pending}</td>
                  <td style={{ padding: '15px' }}>✗ {user.rejected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
