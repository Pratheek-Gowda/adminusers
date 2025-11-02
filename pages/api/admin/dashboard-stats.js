import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const linksResult = await pool.query('SELECT COUNT(*) as count FROM referral_links');
    const referralsResult = await pool.query('SELECT COUNT(*) as count FROM referrals');

    const statusResult = await pool.query('SELECT status, COUNT(*) as count FROM referrals GROUP BY status');
    const statusBreakdown = {};
    statusResult.rows.forEach(row => {
      statusBreakdown[row.status] = row.count;
    });

    res.json({
      success: true,
      stats: {
        totalUsers: usersResult.rows[0].count,
        totalLinks: linksResult.rows[0].count,
        totalReferrals: referralsResult.rows[0].count,
        statusBreakdown: statusBreakdown || { pending: 0, approved: 0, rejected: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
