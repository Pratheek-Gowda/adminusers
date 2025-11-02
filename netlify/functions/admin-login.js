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
    const { username, password } = JSON.parse(event.body);

    // Check hardcoded credentials for Pratheek
    if (username === 'Pratheek' && password === 'adminpratheek') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          admin: {
            id: 1,
            username: 'Pratheek',
            role: 'admin'
          }
        })
      };
    }

    // Also check database
    const result = await pool.query(
      'SELECT id, username, role FROM admin_users WHERE username = $1 LIMIT 1',
      [username]
    );

    if (result.rows.length === 0) {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, error: 'Invalid credentials' })
      };
    }

    const admin = result.rows;
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        admin: { id: admin.id, username: admin.username, role: admin.role }
      })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
