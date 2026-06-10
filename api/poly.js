export default async function handler(req, res) {
    const { slug } = req.query;

    if (!slug) {
        return res.status(400).json({ error: "Falta el parámetro slug" });
    }

    const url = `https://gamma-api.polymarket.com/events?slug=${slug}`;

    try {
        const polyRes = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });

        if (!polyRes.ok) {
            throw new Error(`Error de Polymarket: ${polyRes.status}`);
        }

        const data = await polyRes.json();
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
