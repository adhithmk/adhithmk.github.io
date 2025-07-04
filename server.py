from http.server import SimpleHTTPRequestHandler
from http import HTTPStatus
import socketserver
import os

class CustomHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # Check if the requested path exists
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path) and not os.path.exists(os.path.join(path, 'index.html')):
            # Serve 404.html for all missing files/directories
            self.send_response(HTTPStatus.NOT_FOUND)
            self.send_header('Content-type', 'text/html')
            
            # Read and send the 404.html file
            with open('404.html', 'rb') as f:
                content = f.read()
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
        else:
            # Serve the file if it exists
            super().do_GET()

if __name__ == '__main__':
    PORT = 8000
    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        print(f"Serving at port {PORT}")
        print(f"Open http://localhost:{PORT} in your browser")
        httpd.serve_forever()
