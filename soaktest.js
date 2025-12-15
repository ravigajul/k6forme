import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from './config.js'; // Import base URL from config file

export const options = {
    stages: [
        { duration: '2m', target: 10 }, // Ramp up to 10 users over 2 minutes
        { duration: '3h', target: 10 }, // Stay at 10 users for 3 hours (soak period)
        { duration: '2m', target: 0 },  // Ramp down to 0 users over 2 minutes
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.01'],   // Less than 1% of requests should fail
    },
};

export default function () {
    // Make a GET request to your endpoint
    const res = http.get(`${BASE_URL}/test.k6.io`);
    // Check the response
    check(res, {
        'status is 200': (r) => r.status === 200,
        'response time is acceptable': (r) => r.timings.duration < 500,
    });
    
    sleep(1); // Wait 1 second between iterations
}