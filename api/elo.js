module.exports = async function handler(req, res) {
    // Base de datos inyectada directamente en tu API para esquivar Cloudflare
    const eloData = {
        "Germany": 1980, "Saudi Arabia": 1740, "Algeria": 1820,
        "Argentina": 2140, "Australia": 1850, "Austria": 1860, "Belgium": 1970,
        "Bosnia and Herzegovina": 1670, "Brazil": 2080, "Cape Verde": 1730,
        "Canada": 1750, "Czech Republic": 1740, "Colombia": 2005, "South Korea": 1758,
        "Ivory Coast": 1760, "Croatia": 1990, "Curaçao": 1600, "Ecuador": 1950,
        "Egypt": 1790, "Scotland": 1780, "Spain": 2030, "USA": 1900,
        "France": 2105, "Ghana": 1680, "Haiti": 1610, "England": 2040,
        "Iraq": 1660, "Iran": 1870, "Japan": 1930, "Jordan": 1640,
        "Morocco": 1910, "Mexico": 1868, "Norway": 1830, "New Zealand": 1650,
        "Netherlands": 2020, "Panama": 1690, "Paraguay": 1710, "Portugal": 2015,
        "Qatar": 1630, "DR Congo": 1620, "Senegal": 1920, "South Africa": 1750,
        "Sweden": 1840, "Switzerland": 1940, "Tunisia": 1770, "Turkey": 1810,
        "Uruguay": 2000, "Uzbekistan": 1700
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(eloData);
};
