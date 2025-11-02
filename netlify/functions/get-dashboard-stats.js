const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const users = await pool.query('SELECT COUNT(*) as count FROM users');
    const links = await pool.query('SELECT COUNT(*) as count FROM referral_links');
    const referrals = await pool.query('SELECT COUNT(*) as count FROM referrals');
    const approved = await pool.query("SELECT COUNT(*) as count FROM referrals WHERE status = 'approved'");
    const pending = await pool.query("SELECT COUNT(*) as count FROM referrals WHERE status = 'pending'");
    const rejected = await pool.query("SELECT COUNT(*) as count FROM referrals WHERE status = 'rejected'");
    const credits = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM credits WHERE status = \'credited\'');

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        stats: {
          totalUsers: parseInt(users.rows[0].count),
          totalLinks: parseInt(links.rows[0].count),
          totalReferrals: parseInt(referrals.rows[0].count),
          approvedReferrals: parseInt(approved.rows[0].count),
          pendingReferrals: parseInt(pending.rows[0].count),
          rejectedReferrals: parseInt(rejected.rows[0].count),
          totalCredits: parseFloat(credits.rows[0].total || 0)
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
