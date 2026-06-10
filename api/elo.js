export default async function handler(req, res) {
    try {
        // Obtenemos los datos base de World Football Elo Ratings
        // Ellos almacenan sus datos crudos en archivos .tsv
        const response = await fetch('https://www.eloratings.net/World.tsv');
        
        if (!response.ok) {
            throw new Error(`Error al conectar con Elo Ratings: ${response.status}`);
        }

        const rawData = await response.text();
        const lines = rawData.split('\n');
        
        let eloData = {};

        // Mapeo básico para que coincidan con los nombres en inglés de tu frontend
        // eloratings usa nombres propios que a veces varían ligeramente
        const mapeoNombres = {
            "United States": "USA",
            "South Korea": "South Korea",
            "Czechia": "Czech Republic",
            "DR Congo": "DR Congo",
            "Bosnia/Herzegovina": "Bosnia and Herzegovina"
        };

        for (let line of lines) {
            if (!line) continue;
            let parts = line.split('\t');
            if (parts.length >= 3) {
                let country = parts[1].trim();
                let elo = parseInt(parts[2].trim(), 10);
                
                // Normalizamos el nombre si está en nuestro mapeo
                if (mapeoNombres[country]) {
                    country = mapeoNombres[country];
                }
                
                eloData[country] = elo;
            }
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 's-maxage=3600'); // Cacheamos 1 hora para no saturarlos
        res.status(200).json(eloData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
