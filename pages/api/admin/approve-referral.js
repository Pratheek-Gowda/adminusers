import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { referralId, status, adminUsername } = req.body;

  try {
    await pool.query(
      'UPDATE referrals SET status = $1, approved_at = NOW(), approved_by_admin = $2 WHERE id = $3',
      [status, adminUsername, referralId]
    );

    if (status === 'approved') {
      const referralData = await pool.query(
        'SELECT referral_link_id FROM referrals WHERE id = $1',
        [referralId]
      );
      await pool.query(
        'UPDATE referral_links SET approved_referrals = approved_referrals + 1 WHERE id = $1',
        [referralData.rows[0].referral_link_id]
      );
    }

    res.json({ 
      success: true, 
      message: `Referral ${status} successfully` 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
