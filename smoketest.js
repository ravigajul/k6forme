import http from 'k6/http';
import { check, sleep } from 'k6';
import { BASE_URL } from './config.js'; // Import base URL from config file
//k6 run ./tests/virtualusers.js
export const options = {
  vus: 1, //virtual users
  duration: '30s', //time to run the test
};

export default function () {    
    const res = http.get(`${BASE_URL}/test.k6.io`);     
            check(res, {
                'is status 200': (r) => r.status === 200,
            });     
    sleep(1);
    const res2 = http.get(`${BASE_URL}/contacts.php`); 
            check(res2, {
                'is status 200': (r) => r.status === 200,
            });     
    sleep(2);
    const res3= http.get(`${BASE_URL}/news.php`);
            check(res3, {
                'is status 200': (r) => r.status === 200,
            });     
    sleep(1);
}