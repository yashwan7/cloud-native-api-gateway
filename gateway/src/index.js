import http from 'node:http';
import process from 'node:process';

const port = Number(process.env.PORT || 8080);
const routes = [
  ['/api/auth', process.env.AUTH_SERVICE_URL || 'http://localhost:4001'],
  ['/api/users', process.env.USER_SERVICE_URL || 'http://localhost:4002'],
  ['/api/notifications', process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:4003'],
  ['/api/analytics', process.env.ANALYTICS_SERVICE_URL || 'http://localhost:4004']
];

let requestCount = 0;

function json(response, status, body) {
  const payload = JSON.stringify(body);
  response.writeHead(status, { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) });
  response.end(payload);
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function handle(request, response) {
  requestCount += 1;
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (url.pathname === '/healthz') return json(response, 200, { status: 'ok', service: 'gateway' });
  if (url.pathname === '/readyz') return json(response, 200, { status: 'ready' });
  if (url.pathname === '/metrics') {
    response.writeHead(200, { 'content-type': 'text/plain; version=0.0.4' });
    return response.end(`# HELP gateway_requests_total Total requests received by the gateway\n# TYPE gateway_requests_total counter\ngateway_requests_total ${requestCount}\n`);
  }

  const route = routes.find(([prefix]) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`));
  if (!route) return json(response, 404, { error: 'route_not_found' });

  const [prefix, target] = route;
  const upstreamUrl = `${target}${url.pathname.slice(prefix.length) || '/'}${url.search}`;
  try {
    const body = ['GET', 'HEAD'].includes(request.method) ? undefined : await readBody(request);
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers: { 'content-type': request.headers['content-type'] || 'application/json', 'x-gateway-request': 'cloud-native-api-gateway' },
      body
    });
    const responseBody = Buffer.from(await upstream.arrayBuffer());
    response.writeHead(upstream.status, { 'content-type': upstream.headers.get('content-type') || 'application/octet-stream', 'content-length': responseBody.length });
    return response.end(responseBody);
  } catch (error) {
    return json(response, 502, { error: 'upstream_unavailable', detail: error.message });
  }
}

http.createServer((request, response) => handle(request, response).catch((error) => json(response, 500, { error: 'gateway_error', detail: error.message }))).listen(port, () => {
  console.log(`Gateway listening on http://localhost:${port}`);
});
