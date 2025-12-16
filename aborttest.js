//abort test
import http from 'k6/http';
import { check } from 'k6';
import exec from 'k6/execution';

//k6 run ./tests/aborttest.js
export function setup () {    
    const res = http.get('https://httpbin.org1/status/200');     
    if(res.error){
        console.log('Aborting the test due to error: ' + res.error);
        exec.test.abort('Aborting the test due to error in response');
    }     
}

export default function(){
    http.get('https://httpbin.org1/status/200');
    sleep(1);
}