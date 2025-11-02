const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const userId = event.queryStringParameters?.userId;

    const result = await pool.query(`
      SELECT 
        r.id, r.referred_name, r.referred_email, r.referred_phone, r.order_details,
        r.status, r.created_at, r.approved_at, r.approved_by,
        rl.referral_code, rl.operator
      FROM referrals r
      JOIN referral_links rl ON r.referral_link_id = rl.id
      WHERE rl.user_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        referrals: result.rows
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
