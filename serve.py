from http.server import SimpleHTTPRequestHandler
import socketserver
import os

PORT = 8000

class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Check if the requested path exists
        path = self.translate_path(self.path)
        if not os.path.exists(path):
            # Serve 404.html
            self.send_error(404, "File not found")
            with open('404.html', 'rb') as f:
                self.send_response(404)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(f.read())
            return
        return SimpleHTTPRequestHandler.do_GET(self)

Handler = CustomHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at port {PORT}")
    print("Press Ctrl+C to stop")
    httpd.serve_forever()
