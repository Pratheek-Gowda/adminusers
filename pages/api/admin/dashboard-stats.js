import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    // Total users
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = usersResult.rows[0].count;

    // Total referral links
    const linksResult = await pool.query('SELECT COUNT(*) as count FROM referral_links');
    const totalLinks = linksResult.rows[0].count;

    // Total referrals
    const referralsResult = await pool.query('SELECT COUNT(*) as count FROM referrals');
    const totalReferrals = referralsResult.rows[0].count;

    // Referrals by status
    const statusResult = await pool.query(`
      SELECT status, COUNT(*) as count FROM referrals GROUP BY status
    `);
    
    const statusBreakdown = {};
    statusResult.rows.forEach(row => {
      statusBreakdown[row.status] = row.count;
    });

    // Top referrers
    const topReferrersResult = await pool.query(`
      SELECT 
        u.id,
        u.username,
        u.full_name,
        u.email,
        COUNT(r.id) as total_referrals,
        COUNT(CASE WHEN r.status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN r.status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN r.status = 'rejected' THEN 1 END) as rejected
      FROM users u
      LEFT JOIN referral_links rl ON u.id = rl.user_id
      LEFT JOIN referrals r ON rl.id = r.referral_link_id
      GROUP BY u.id, u.username, u.full_name, u.email
      ORDER BY total_referrals DESC
    `);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalLinks,
        totalReferrals,
        statusBreakdown: statusBreakdown || { pending: 0, approved: 0, rejected: 0 },
        topReferrers: topReferrersResult.rows
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
