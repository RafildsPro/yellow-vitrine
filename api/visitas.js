export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(503).json({ error: 'KV não configurado' });
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    if (req.method === 'POST') {
      const r = await fetch(`${url}/incr/visitas`, { method: 'POST', headers });
      const data = await r.json();
      return res.json({ count: data.result });
    } else {
      const r = await fetch(`${url}/get/visitas`, { headers });
      const data = await r.json();
      return res.json({ count: parseInt(data.result) || 0 });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Erro ao acessar KV' });
  }
}
