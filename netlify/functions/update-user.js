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
    const { userId, fullName, email, phone, status } = JSON.parse(event.body);

    const result = await pool.query(
      'UPDATE users SET full_name = $1, email = $2, phone = $3, status = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [fullName, email, phone, status, userId]
    );

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: 'User not found' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        user: result.rows
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
