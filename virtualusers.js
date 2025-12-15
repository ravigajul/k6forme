import http from 'k6/http';
import { check, sleep } from 'k6';

//k6 run ./tests/virtualusers.js
export const options = {
  vus: 10, //virtual users
  duration: '10s', //time to run the test
};

export default function () {    
    const res = http.get('https://quickpizza.grafana.com/test.k6.io');     
    check(res, {
        'is status 200': (r) => r.status === 200,
    });     
    sleep(1);
}