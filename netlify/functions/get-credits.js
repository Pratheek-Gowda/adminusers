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
    const { userId, amount, reason, adminNotes, adminId } = JSON.parse(event.body);

    const result = await pool.query(
      'INSERT INTO credits (user_id, amount, status, reason, admin_notes, admin_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *',
      [userId, amount, 'credited', reason, adminNotes, adminId]
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, credit: result.rows[0] })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
