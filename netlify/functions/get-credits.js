// --- Corrected get-credit.js ---

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // Adjust the origin as needed
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

exports.handler = async (event) => {
    // 1. Handle OPTIONS pre-flight request for CORS (if needed)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: ''
        };
    }
    
    // 2. Enforce GET for retrieving data
    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        // 3. Perform a SELECT query to retrieve credits data (Correct for 'GET')
        const result = await pool.query(
            // Joins users table to get usernames for display
            'SELECT c.*, u.username FROM credits c JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC'
            // NOTE: Modify the SELECT to include any necessary join for the admin's username if needed
        );

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ success: true, credits: result.rows })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
