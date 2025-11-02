const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.username, u.email, u.full_name, u.created_at,
        COUNT(rl.id) as total_links,
        COUNT(r.id) as total_referrals,
        COALESCE(SUM(CASE WHEN r.status = 'approved' THEN 1 ELSE 0 END), 0) as approved_count
      FROM users u
      LEFT JOIN referral_links rl ON u.id = rl.user_id
      LEFT JOIN referrals r ON rl.referral_link_id = r.referral_link_id
      GROUP BY u.id, u.username, u.email, u.full_name, u.created_at
      ORDER BY u.created_at DESC
    `);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        users: result.rows
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
