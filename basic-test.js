import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from './config.js'; // Import base URL from config file
//k6 run ./tests/basic-test.js
export default function () {    
    const res = http.get(`${BASE_URL}/test.k6.io`);     
    check(res, {
        'is status 200': (r) => r.status === 200,
    });     
    sleep(1);
}