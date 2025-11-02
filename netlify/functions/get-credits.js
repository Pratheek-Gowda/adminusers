const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id, c.user_id, c.amount, c.status, c.reason, c.admin_notes,
        c.created_at, c.admin_id,
        u.username, u.email, u.full_name
      FROM credits c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        credits: result.rows
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
