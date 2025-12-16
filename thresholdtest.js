import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from './config.js'; // Import base URL from config file
//k6 run ./tests/basic-test.js

export const options = {
    vus: 10,
    duration: '30s',
    thresholds: {
        http_req_duration: ['p(95)<50'], // 95% of requests must complete below 500ms
        http_req_failed: ['rate<0.01'], // Error rate should be less than 1%
        http_reqs: ['count>100'], // Total requests should be greater than 100
        http_reqs: ['rate>20'], // Requests per second should be greater than 20
        vus:['value>9'], // Number of virtual users should be exactly 10
    }
};
export default function () {    
    const res = http.get(`${BASE_URL}/test.k6.io`);     
    check(res, {
        'is status 200': (r) => r.status === 200,
        'does body contain QuickPizza Legacy': (r) => r.body.includes("QuickPizza Legacy")
    }); 
    sleep(2);
}
