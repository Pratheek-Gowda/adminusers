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
    const { referralId, status, approvedBy } = JSON.parse(event.body);

    const result = await pool.query(
      'UPDATE referrals SET status = $1, approved_at = NOW(), approved_by_admin = $2 WHERE id = $3 RETURNING *',
      [status, approvedBy, referralId]
    );

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: 'Referral not found' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        referral: result.rows[0]
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
