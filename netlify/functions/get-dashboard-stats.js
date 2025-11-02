const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    const linksCount = await pool.query('SELECT COUNT(*) FROM referral_links');
    const referralsCount = await pool.query('SELECT COUNT(*) FROM referrals');
    const approvedCount = await pool.query('SELECT COUNT(*) FROM referrals WHERE status = $1', ['approved']);
    const pendingCount = await pool.query('SELECT COUNT(*) FROM referrals WHERE status = $1', ['pending']);
    const rejectedCount = await pool.query('SELECT COUNT(*) FROM referrals WHERE status = $1', ['rejected']);
    const creditsCount = await pool.query('SELECT COALESCE(SUM(amount), 0) as total FROM credits WHERE status = $1', ['credited']);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        stats: {
          totalUsers: parseInt(usersCount.rows.count),
          totalLinks: parseInt(linksCount.rows.count),
          totalReferrals: parseInt(referralsCount.rows.count),
          approvedReferrals: parseInt(approvedCount.rows.count),
          pendingReferrals: parseInt(pendingCount.rows.count),
          rejectedReferrals: parseInt(rejectedCount.rows.count),
          totalCredits: parseFloat(creditsCount.rows.total)
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
