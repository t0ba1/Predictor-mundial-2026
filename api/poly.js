module.exports = async function handler(req, res) {
    const { a, b } = req.query;
    if (!a || !b) return res.status(400).json({ error: "Faltan equipos" });

    // Truco: Buscamos solo por el primer equipo para no romper el buscador nativo
    const url = `https://gamma-api.polymarket.com/events?query=${encodeURIComponent(a)}&active=true&closed=false`;

    try {
        const polyRes = await fetch(url, {
            headers: { 'Accept': 'application/json' }
        });

        if (!polyRes.ok) throw new Error(`Polymarket rechazó la conexión: ${polyRes.status}`);

        const data = await polyRes.json();
        
        // Filtramos nosotros mismos el partido correcto
        let eventoEncontrado = null;
        if (data && data.length > 0) {
            eventoEncontrado = data.find(ev => 
                ev.title.toLowerCase().includes(a.toLowerCase()) && 
                ev.title.toLowerCase().includes(b.toLowerCase())
            );
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(eventoEncontrado ? [eventoEncontrado] : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
