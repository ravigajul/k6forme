// Configuration file for K6 performance tests

// Base URL for the API/application under test
export const BASE_URL = 'https://quickpizza.grafana.com';

// Alternative URLs for different environments
export const ENVIRONMENTS = {
    dev: 'https://dev-api.example.com',
    staging: 'https://staging-api.example.com',
    production: 'https://api.example.com',
};

// You can also add other configuration options
export const CONFIG = {
    defaultTimeout: 30000, // 30 seconds
    defaultSleep: 1, // 1 second between requests
    thresholds: {
        responseTime: 500, // ms
        errorRate: 0.01, // 1%
    },
};

// Export environment-specific URL (can be changed via environment variable)
export const getBaseUrl = () => {
    const env = __ENV.ENV || 'production'; // Get from k6 environment variable
    return ENVIRONMENTS[env] || BASE_URL;
};