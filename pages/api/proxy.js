export default async function handler(req, res) {
  const { path } = req.query;
  const apiUrl = `https://refer.pratheek.shop/api/${path.join('/')}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
