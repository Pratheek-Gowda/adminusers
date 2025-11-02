const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event) => {
  try {
    // Test 1: Simple query
    const timeResult = await pool.query('SELECT NOW() as current_time');
    
    // Test 2: Count users
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    
    // Test 3: Count referrals
    const referralsResult = await pool.query('SELECT COUNT(*) as count FROM referrals');

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Database connected successfully!',
        database_time: timeResult.rows[0].current_time,
        total_users: parseInt(usersResult.rows[0].count),
        total_referrals: parseInt(referralsResult.rows[0].count),
        connection_status: 'ACTIVE ✅'
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message,
        connection_status: 'FAILED ❌'
      })
    };
  }
};
