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

    if (username === 'Pratheek' && password === 'adminpratheek') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          admin: { id: 1, username: 'Pratheek', role: 'admin' }
        })
      };
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, error: 'Invalid credentials' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
