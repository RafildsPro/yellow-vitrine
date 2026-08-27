export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(503).json({ error: 'KV não configurado' });
  }

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const hoje = new Date().toISOString().slice(0, 10); // "2026-08-27"
  const chaveHoje = `visitas:${hoje}`;

  try {
    if (req.method === 'POST') {
      // Incrementa total e hoje em pipeline (1 request)
      const r = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers,
        body: JSON.stringify([
          ['INCR', 'visitas'],
          ['INCR', chaveHoje],
          ['EXPIRE', chaveHoje, 86400 * 7], // expira em 7 dias
        ]),
      });
      const data = await r.json();
      return res.json({ total: data[0]?.result, hoje: data[1]?.result });
    } else {
      // Lê total e hoje em pipeline
      const r = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers,
        body: JSON.stringify([
          ['GET', 'visitas'],
          ['GET', chaveHoje],
        ]),
      });
      const data = await r.json();
      return res.json({
        total: parseInt(data[0]?.result) || 0,
        hoje: parseInt(data[1]?.result) || 0,
      });
    }
  } catch (e) {
    return res.status(500).json({ error: 'Erro ao acessar KV' });
  }
}
