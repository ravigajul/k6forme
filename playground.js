import http from 'k6/http';
import { check, sleep } from 'k6';
import  { BASE_URL } from './config.js'; // Import base URL from config file
//k6 run ./tests/spiketest.js
export const options = {
  stages: [
    { duration: "10s", target: 10 }, // Normal load
    { duration: "10s", target: 50 }, // Spike to 50 users
    { duration: "10s", target: 10 }, // Back to normal load
  ],
};

export default function () {
  const res= http.
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
}