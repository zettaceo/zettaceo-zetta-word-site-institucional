import http.server
import socketserver
import os
import json
import urllib.request
import urllib.parse

PORT = 5000
HOST = "0.0.0.0"
BOT_API_URL = "http://127.0.0.1:3001"

class ZettaHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/download':
            zip_path = 'zetta-word-site.zip'
            if os.path.exists(zip_path):
                self.send_response(200)
                self.send_header('Content-Type', 'application/zip')
                self.send_header('Content-Disposition', 'attachment; filename="zetta-word-site.zip"')
                self.send_header('Content-Length', str(os.path.getsize(zip_path)))
                self.end_headers()
                with open(zip_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'ZIP file not found')
        elif self.path == '/api/health':
            self.proxy_to_bot()
        else:
            super().do_GET()

    def do_POST(self):
        if self.path == '/api/chat':
            self.proxy_to_bot()
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'Not found')

    def proxy_to_bot(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length) if content_length > 0 else None
            
            url = BOT_API_URL + self.path
            req = urllib.request.Request(
                url,
                data=body,
                headers={'Content-Type': 'application/json'} if body else {},
                method=self.command
            )
            
            with urllib.request.urlopen(req, timeout=30) as response:
                data = response.read()
                self.send_response(response.status)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(data)
        except Exception as e:
            self.send_response(503)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Bot service unavailable'}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer((HOST, PORT), ZettaHandler) as httpd:
        print(f"Serving on http://{HOST}:{PORT}")
        httpd.serve_forever()
