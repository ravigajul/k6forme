import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from './config.js'; // Import base URL from config file
//k6 run ./tests/basic-test.js

export const options = {
    thresholds: {
        http_req_duration: ['p(95)<1000'], // 95% of requests must complete below 1000ms
        'http_req_duration{status:200}': ['p(95)<1000'], // 95% of requests with status 200 must complete below 1000ms
        'http_req_duration{status:201}': ['p(95)<1000'],
    }
};
export default function () {    
    let res = http.get('https://caacd4e90b7e4948b25df8810e89bb4b.api.mockbin.io/');    
    sleep(1);
    res = http.get('https://3c5c62b313d441c7944e0dc1c53589ed.api.mockbin.io?mocky-delay=2000ms');
    sleep(1);
}