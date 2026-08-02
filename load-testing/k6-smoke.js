import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = { vus: 2, duration: '10s' };

export default function () {
  const response = http.get(`${__ENV.BASE_URL || 'http://localhost:8080'}/healthz`);
  check(response, { 'gateway is healthy': (r) => r.status === 200 });
  sleep(1);
}
