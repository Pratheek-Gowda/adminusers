const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const result = await pool.query(`
      SELECT 
        r.id, r.referred_name, r.referred_email, r.referred_phone, r.order_details,
        r.status, r.created_at, r.approved_at, r.approved_by_admin,
        rl.referral_code, rl.operator, rl.user_id
      FROM referrals r
      JOIN referral_links rl ON r.referral_link_id = rl.id
      ORDER BY r.created_at DESC
    `);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, referrals: result.rows || [] })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
