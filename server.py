import urllib.request
from http.server import HTTPServer, SimpleHTTPRequestHandler

class PolymarketProxy(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Si la petición de tu HTML es para extraer datos, Python hace el trabajo sucio
        if self.path.startswith('/api/poly/'):
            slug = self.path.split('/')[-1]
            url = f"https://gamma-api.polymarket.com/events?slug={slug}"
            
            # Engañamos a Cloudflare presentándonos como un navegador real, no como un bot
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            try:
                with urllib.request.urlopen(req) as response:
                    data = response.read()
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(data)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f'{{"error": "{str(e)}"}}'.encode())
        else:
            # Si no es una extracción, sirve tu interfaz visual normal
            super().do_GET()

print("Motor de extracción local iniciado.")
print("Abrí http://localhost:8000 en tu navegador web.")
HTTPServer(('', 8000), PolymarketProxy).serve_forever()
