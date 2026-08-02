import http from 'node:http';
const name = 'notification-service';
const port = Number(process.env.PORT || 4003);
http.createServer((request, response) => {
  const body = JSON.stringify(request.url === '/healthz' ? { status: 'ok', service: name } : { service: name, method: request.method, path: request.url });
  response.writeHead(200, { 'content-type': 'application/json', 'content-length': Buffer.byteLength(body) });
  response.end(body);
}).listen(port, () => console.log(`${name} listening on http://localhost:${port}`));
