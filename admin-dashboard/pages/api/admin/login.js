
mport { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admin_users WHERE username=$1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    res.json({ success: true, admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
