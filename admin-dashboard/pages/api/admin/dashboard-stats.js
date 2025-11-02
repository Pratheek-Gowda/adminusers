
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

export default async function handler(req, res) {
  try {
    const result = await pool.query(`
      SELECT r.id, r.referred_name, r.referred_email, r.referred_phone, r.order_details, r.status, r.created_at,
             rl.referral_code, rl.operator,
             u.id as user_id, u.username as referrer_username, u.full_name as referrer_name, u.email as referrer_email
      FROM referrals r
      JOIN referral_links rl ON r.referral_link_id = rl.id
      JOIN users u ON rl.user_id = u.id
      ORDER BY r.created_at DESC
    `);
    res.json({ success: true, allReferrals: result.rows, count: result.rows.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
