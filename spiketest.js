/* Characteristics:
Sudden dramatic increase in load (0 → 200 users in seconds)
Very short duration at peak load
Tests system's ability to handle traffic bursts
Validates auto-scaling and failover mechanisms
Goal: Ensure system survives sudden traffic spikes
Example: Product goes viral on social media, 1000 users hit site instantly
*/

import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 }, // Normal load
    { duration: "5s", target: 200 }, // SPIKE! Sudden jump to 200 users
    { duration: "10s", target: 200 }, // Hold spike briefly
    { duration: "5s", target: 10 }, // Quick drop back to normal
    { duration: "10s", target: 0 }, // Ramp-down
  ],
  thresholds: {
    http_req_duration: ["p(95)<1000"], // More lenient during spike
    http_req_failed: ["rate<0.15"], // Allow 15% errors during spike
  },
};

export default function () {
  const res = http.get("https://quickpizza.grafana.com/test.k6.io");
  check(res, {
    "is status 200": (r) => r.status === 200,
    "response time < 1000ms": (r) => r.timings.duration < 1000,
  });
  sleep(1);
}
