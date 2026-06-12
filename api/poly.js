module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const { a, b } = req.query;
    if (!a || !b) {
        return res.status(400).json({ error: "Faltan los equipos" });
    }

    // Normalización de nombres para maximizar el éxito del buscador de Polymarket
    let searchName = a;
    if (a.toLowerCase() === "corea del sur" || a.toLowerCase() === "south korea") searchName = "Korea";
    if (a.toLowerCase() === "chequia" || a.toLowerCase() === "czech republic") searchName = "Czech";

    const url = `https://gamma-api.polymarket.com/events?query=${encodeURIComponent(searchName)}&active=true&closed=false`;

    try {
        const polyRes = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'application/json'
            }
        });

        if (!polyRes.ok) throw new Error(`Polymarket API respondió status: ${polyRes.status}`);

        const data = await polyRes.json();
        if (!data || data.length === 0) {
            return res.status(200).json({ mktReal: false, msg: "No hay eventos activos para " + searchName });
        }

        // Limpieza flexible para matchear los equipos
        const limpiar = (str) => str.toLowerCase().replace(/republic|del sur|república/g, "").trim();
        const tokenA = limpiar(a);
        const tokenB = limpiar(b);

        // Encontrar el partido correcto dentro de los eventos devueltos
        let evento = data.find(ev => {
            const title = ev.title.toLowerCase();
            return (title.includes(tokenA) || (tokenA.includes("korea") && title.includes("korea"))) && 
                   (title.includes(tokenB) || (tokenB.includes("czech") && title.includes("czech")) || title.includes("cze") || title.includes("cheq"));
        });

        if (!evento) evento = data.find(ev => ev.markets && ev.markets.length > 0);
        if (!evento || !evento.markets || evento.markets.length === 0) {
            return res.status(200).json({ mktReal: false, msg: "Evento encontrado sin mercados válidos" });
        }

        let mktLocal = null, mktEmpate = null, mktVisit = null;

        // Procesar los mercados internos del evento deportivo
        for (let m of evento.markets) {
            if (!m.outcomes || !m.outcomePrices) continue;

            let outcomes = typeof m.outcomes === 'string' ? JSON.parse(m.outcomes) : m.outcomes;
            let prices = typeof m.outcomePrices === 'string' ? JSON.parse(m.outcomePrices) : m.outcomePrices;

            if (!outcomes || !prices || prices.length === 0) continue;

            // ESTRUCTURA MULTI-VÍA (Mundial estándar: Local, Visitante, Empate juntos)
            if (outcomes.length >= 3) {
                for (let i = 0; i < outcomes.length; i++) {
                    let label = outcomes[i].toLowerCase();
                    let p = parseFloat(prices[i]);
                    if (isNaN(p)) continue;

                    if (label.includes(tokenA) || (tokenA.includes("korea") && label.includes("kr")) || (tokenA.includes("mexic") && label.includes("mex"))) {
                        mktLocal = p;
                    } else if (label.includes(tokenB) || (tokenB.includes("south") && label.includes("za")) || (tokenB.includes("cheq") && label.includes("cze"))) {
                        mktVisit = p;
                    } else if (label.includes("draw") || label.includes("empate") || label.includes("tie")) {
                        mktEmpate = p;
                    }
                }
            } 
            // ESTRUCTURA BINARIA (Mercados individuales por separado)
            else if (outcomes.length === 2) {
                let question = (m.question || m.groupItemTitle || "").toLowerCase();
                let idxYes = outcomes.findIndex(o => o.toLowerCase() === 'yes');
                if (idxYes === -1) idxYes = 0;
                let p = parseFloat(prices[idxYes]);
                if (isNaN(p)) continue;

                if (question.includes(tokenA)) mktLocal = p;
                else if (question.includes(tokenB)) mktVisit = p;
                else if (question.includes("draw") || question.includes("empate") || question.includes("tie")) mktEmpate = p;
            }
        }

        if (mktLocal !== null && mktVisit !== null) {
            if (mktEmpate === null) mktEmpate = 0.0;
            return res.status(200).json({
                mktReal: true,
                local: mktLocal,
                empate: mktEmpate,
                visitante: mktVisit
            });
        }

        return res.status(200).json({ mktReal: false, msg: "Mercados encontrados pero cuotas incompletas" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
