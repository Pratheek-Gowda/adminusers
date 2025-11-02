const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { userId } = JSON.parse(event.body);
    
    await pool.query('DELETE FROM referrals WHERE referral_link_id IN (SELECT id FROM referral_links WHERE user_id = $1)', [userId]);
    await pool.query('DELETE FROM referral_links WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'User deleted successfully'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
