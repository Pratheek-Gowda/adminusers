const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id, r.referred_name, r.referred_email, r.referred_phone, r.status,
        r.approved_at, r.approved_by_admin, r.created_at,
        u.username as referrer_name, u.email as referrer_email
      FROM referrals r
      JOIN referral_links rl ON r.referral_link_id = rl.id
      JOIN users u ON rl.user_id = u.id
      WHERE r.status IN ('approved', 'rejected')
      ORDER BY r.approved_at DESC
    `);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        history: result.rows
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
