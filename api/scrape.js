export default async function handler(req, res) {
  // Headers para evitar o erro de CORS quando formos testar no botão do painel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Responde imediatamente a requisições de pré-verificação (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Apenas requisições POST são permitidas.' });
  }

  const { url, token } = req.body;

  if (!url || !token) {
    return res.status(400).json({ error: 'URL e Token são obrigatórios.' });
  }

  try {
    // A Vercel faz a chamada para a Meta (IP limpo e sem bloqueios)
    const response = await fetch('https://graph.facebook.com/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `id=${encodeURIComponent(url)}&scrape=true&access_token=${token}`
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
