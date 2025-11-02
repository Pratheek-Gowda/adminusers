const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) as count FROM users');
    const linksCount = await pool.query('SELECT COUNT(*) as count FROM referral_links');
    const referralsCount = await pool.query('SELECT COUNT(*) as count FROM referrals');
    const approvedCount = await pool.query("SELECT COUNT(*) as count FROM referrals WHERE status = 'approved'");
    const pendingCount = await pool.query("SELECT COUNT(*) as count FROM referrals WHERE status = 'pending'");
    const rejectedCount = await pool.query("SELECT COUNT(*) as count FROM referrals WHERE status = 'rejected'");

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        stats: {
          totalUsers: parseInt(usersCount.rows[0].count),
          totalLinks: parseInt(linksCount.rows[0].count),
          totalReferrals: parseInt(referralsCount.rows[0].count),
          approvedReferrals: parseInt(approvedCount.rows[0].count),
          pendingReferrals: parseInt(pendingCount.rows[0].count),
          rejectedReferrals: parseInt(rejectedCount.rows[0].count),
          totalCredits: 0
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
