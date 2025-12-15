//3 stags of load testing: ramp-up, steady-state, ramp-down
// npm install -g k6-html-reporter
// k6 run --out json=results.json loadtest.js
// k6-html-reporter results.json
/* Characteristics:

Tests expected user load (e.g., 50 concurrent users)
Validates performance under normal operations
Checks if system meets performance requirements
Goal: Ensure system handles typical traffic
Example: Your e-commerce site usually has 100 users during business hours */
import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL } from './config.js'; // Import base URL from config file
export const options = {
  stages: [
    { duration: "10s", target: 10 }, // Ramp-up to 10 users over 10 seconds
    { duration: "30s", target: 10 }, // Steady-state at 10 users for 30 seconds
    { duration: "10s", target: 0}, // Ramp-down to 0 users over 10 seconds
  ],
};

export default function () {
  const res=http.get(`${BASE_URL}/test.k6.io`);
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
}
