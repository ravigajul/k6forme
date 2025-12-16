# K6 Performance Testing Guide

## What is K6?
K6 is an open-source load testing tool for testing the performance of APIs, microservices, and websites. It's developer-friendly and uses JavaScript for test scripts.

## Installation
```bash
# macOS
brew install k6

# Verify installation
k6 version
```

---

## Project Structure

```
K6PerformanceTestingForMe/
├── config.js           # Configuration file with BASE_URL and settings
├── basic-test.js       # Simple smoke test
├── loadtest.js         # Load test (normal capacity)
├── stresstest.js       # Stress test (beyond limits)
├── spiketest.js        # Spike test (sudden burst)
├── soaktest.js         # Soak test (extended duration)
└── debugtest.js        # Debug test with HTTP details
```

---

## Quick Start Examples

### 1. Basic Test (Smoke Test)
**Purpose**: Quick sanity check - is the system working?

```bash
k6 run basic-test.js
```

**What it does**: Single user, quick check if endpoint responds

---

### 2. Load Test 🎯
**Purpose**: Test normal expected load

```bash
npm run test:load
# or
k6 run --out json=results.json loadtest.js && k6-html-reporter results.json
```

**Pattern**: 10 users → 30s steady → ramp down

---

### 3. Stress Test 💥
**Purpose**: Find breaking point

```bash
npm run test:stress
# or
k6 run --out json=stress-results.json stresstest.js && k6-html-reporter stress-results.json
```

**Pattern**: Gradually push to 20 users (beyond normal)

---

### 4. Spike Test ⚡
**Purpose**: Test sudden traffic burst

```bash
npm run test:spike
# or
k6 run --out json=spike-results.json spiketest.js && k6-html-reporter spike-results.json
```

**Pattern**: 10 users → SPIKE to 200 → drop back

---

### 5. Soak Test 🔋
**Purpose**: Find memory leaks over time

```bash
npm run test:soak
# or
k6 run --out json=soak-results.json soaktest.js && k6-html-reporter soak-results.json
```

**Pattern**: 10 users for 3 hours (long duration)

---

### 6. Debug Test 🔍
**Purpose**: See detailed HTTP request/response

```bash
# Show full details (headers + body)
k6 run debugtest.js --http-debug="full"

# Show headers only
k6 run debugtest.js --http-debug
```

**Use when**: Debugging failed requests or checking response data

---

## Configuration (config.js)

```javascript
// Change this to test different environments
export const BASE_URL = 'https://quickpizza.grafana.com';

// Run with different environment
k6 run -e ENV=staging loadtest.js
```

**Available settings**:
- `BASE_URL`: Main endpoint to test
- `CONFIG.thresholds.responseTime`: Max acceptable response time (500ms)
- `CONFIG.thresholds.errorRate`: Max acceptable error rate (1%)

---

## NPM Scripts

```json
{
  "test:load": "Load test with HTML report",
  "test:stress": "Stress test with HTML report",
  "test:spike": "Spike test with HTML report",
  "test:soak": "Soak test with HTML report",
  "test:report": "Generate report from existing results.json"
}
```

---

## Types of Performance Tests

### Visual Comparison

```
Load:       ___________          (Normal capacity - 10 users)
           /           \

Stress:            _____          (Beyond limits - 20 users)
                  /     \
          _______/       \_____

Spike:     |__|                  (Sudden burst - 200 users)
               

Soak:      _________________     (Extended duration - 3 hours)
          /                 \
```

---

## Common Commands

```bash
# Run basic test
k6 run basic-test.js

# Run with debug info
k6 run loadtest.js --http-debug="full"

# Run with custom VUs and duration
k6 run --vus 10 --duration 30s basic-test.js

# Generate HTML report
k6 run --out json=results.json loadtest.js
k6-html-reporter results.json

# Run specific environment
k6 run -e ENV=staging loadtest.js
```

---

## Understanding Results

### Terminal Output
```
✓ is status 200           (All requests passed)

http_req_duration..........: avg=145ms  p(95)=250ms
http_req_failed............: 0.00%     (No errors)
http_reqs..................: 1000      (Total requests)
vus........................: 10        (Virtual users)
```

### Key Metrics
- **http_req_duration**: Response time (lower is better)
- **p(95)**: 95% of requests were faster than this
- **http_req_failed**: Error rate (lower is better)
- **http_reqs**: Total requests completed

### Good Results ✅
- p(95) < 500ms
- Error rate < 1%
- No timeouts

### Bad Results ❌
- p(95) > 1000ms
- Error rate > 5%
- Increasing response times

---

## Test Type Decision Tree

```
What do you want to test?

├─ Normal traffic?
│  └─ Use: Load Test (loadtest.js)
│
├─ Maximum capacity?
│  └─ Use: Stress Test (stresstest.js)
│
├─ Sudden traffic spike?
│  └─ Use: Spike Test (spiketest.js)
│
├─ Memory leaks?
│  └─ Use: Soak Test (soaktest.js)
│
└─ Debugging requests?
   └─ Use: Debug Test (debugtest.js --http-debug="full")
```

---

## Comparison Table

| Test | Users | Duration | Goal | File |
|------|-------|----------|------|------|
| **Load** | 10 | 50s | Validate normal capacity | loadtest.js |
| **Stress** | 20 | 50s | Find breaking point | stresstest.js |
| **Spike** | 10→200 | 40s | Handle traffic burst | spiketest.js |
| **Soak** | 10 | 3h | Find memory leaks | soaktest.js |
| **Debug** | 1 | Quick | Debug requests | debugtest.js |

---

## Resources
- [K6 Documentation](https://k6.io/docs/)
- [K6 Examples](https://k6.io/docs/examples/)
- [K6 Test Types](https://k6.io/docs/test-types/introduction/)
- [HTML Reporter](https://github.com/benc-uk/k6-reporter)
