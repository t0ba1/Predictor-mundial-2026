module.exports = async function handler(req, res) {
    const { a, b } = req.query;

    if (!a || !b) {
        return res.status(400).json({ error: "Faltan los equipos" });
    }

    const searchQuery = `${a} ${b}`;
    const url = `https://gamma-api.polymarket.com/events?query=${encodeURIComponent(searchQuery)}&active=true&closed=false`;

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
        
        let eventoEncontrado = null;
        if (data && data.length > 0) {
            eventoEncontrado = data.find(ev => 
                ev.title.toLowerCase().includes(a.toLowerCase()) && 
                ev.title.toLowerCase().includes(b.toLowerCase())
            );
            if (!eventoEncontrado) eventoEncontrado = data[0]; 
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(eventoEncontrado ? [eventoEncontrado] : []);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
