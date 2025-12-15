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

## Types of Performance Tests

### 1. **Load Test** 🎯
Tests system under **expected normal load**.

**When to use**: Regular testing, validate SLAs

**Visual Pattern**:
```
Virtual Users (VUs)
    |
 10 |     __________(steady state)__________
    |    /                                   \
    |   /                                     \
  0 |__/______________________________________\___
    |-------------------------------------------> Time
    0s      10s             40s            50s

Pattern: Gradual ramp-up → Steady load → Ramp-down
```

**Example Scenario**:
- Normal traffic: 100 concurrent users
- Business hours load
- Steady, predictable traffic

**Code**:
```javascript
stages: [
  { duration: "10s", target: 10 },  // Ramp-up
  { duration: "30s", target: 10 },  // Steady state
  { duration: "10s", target: 0 },   // Ramp-down
]
```

---

### 2. **Stress Test** 💥
Pushes system **beyond normal capacity** to find breaking point.

**When to use**: Find limits, capacity planning

**Visual Pattern**:
```
Virtual Users (VUs)
    |
150 |                    _____(peak stress)
    |                   /                  \
100 |                  /                    \
    |                 /                      \
 50 |                /                        \
    |               /                          \
  0 |______________/____________________________\___
    |------------------------------------------------> Time
    0s      40s       60s      100s          140s

Pattern: Aggressive ramp-up → Extended high load → Gradual recovery
```

**Example Scenario**:
- Push to 200-500+ users
- Identify maximum capacity
- See how system degrades/fails

**Code**:
```javascript
stages: [
  { duration: "40s", target: 100 },  // Ramp-up
  { duration: "20s", target: 100 },  // Hold
  { duration: "40s", target: 150 },  // Push beyond limits
  { duration: "40s", target: 0 },    // Recovery
]
```

---

### 3. **Spike Test** ⚡
Tests **sudden dramatic increase** in load.

**When to use**: Viral events, flash sales, auto-scaling validation

**Visual Pattern**:
```
Virtual Users (VUs)
    |
200 |         _____(sudden spike!)
    |        |     |
    |        |     |
100 |        |     |
    |        |     |
    |        |     |
  0 |________|     |_______________________
    |----------------------------------------> Time
    0s     10s   15s   25s              40s

Pattern: Normal → INSTANT SPIKE → Brief hold → Quick drop
```

**Example Scenario**:
- Product goes viral on social media
- Black Friday sudden rush
- Celebrity tweet drives instant traffic

**Code**:
```javascript
stages: [
  { duration: "10s", target: 10 },   // Normal
  { duration: "5s", target: 200 },   // SPIKE!
  { duration: "10s", target: 200 },  // Hold spike
  { duration: "5s", target: 10 },    // Drop back
  { duration: "10s", target: 0 },    // Ramp-down
]
```

---

### 4. **Soak Test** 🔋
Tests system **reliability over extended period**.

**When to use**: Find memory leaks, resource degradation

**Visual Pattern**:
```
Virtual Users (VUs)
    |
 50 |     _____________________________________(hours/days)
    |    /                                                 \
    |   /                                                   \
  0 |__/____________________________________________________\___
    |---------------------------------------------------------> Time
    0m    5m                    4+ hours                   245m

Pattern: Quick ramp → VERY LONG steady state → Ramp-down
```

**Example Scenario**:
- Run for 4+ hours
- Detect memory leaks
- Database connection pool issues
- Gradual performance degradation

**Code**:
```javascript
stages: [
  { duration: "5m", target: 50 },    // Ramp-up
  { duration: "4h", target: 50 },    // Extended run (soak)
  { duration: "5m", target: 0 },     // Ramp-down
]
```

---

## Visual Comparison: All Test Types

```
Load Test:      ___________          (Normal capacity)
               /           \

Stress Test:           _____          (Beyond limits)
                      /     \
              _______/       \_____

Spike Test:    |__|                  (Sudden burst)
               

Soak Test:     _________________     (Extended duration)
              /                 \
```

---

## Quick Start

### Run Tests
```bash
# Load test
npm run test:load

# Stress test
npm run test:stress

# Spike test
npm run test:spike
```

### Generate HTML Report
```bash
# Install reporter (first time only)
npm run install:reporter

# Tests automatically generate reports
# Open summary.html to view results
```

---

## Test Structure

```javascript
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    // Define your load pattern here
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% under 500ms
    http_req_failed: ['rate<0.1'],      // <10% errors
  },
};

export default function () {
  const res = http.get("YOUR_URL");
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
  sleep(1);
}
```

---

## Key Metrics

| Metric | Description | Good Threshold |
|--------|-------------|----------------|
| **http_req_duration** | Response time | p(95) < 500ms |
| **http_req_failed** | Error rate | < 1% (0.01) |
| **vus** | Virtual users (concurrent) | Based on expected load |
| **iterations** | Total requests completed | Higher is better |
| **http_reqs** | Requests per second | Throughput metric |

---

## Comparison Table

| Test Type | Load Pattern | Duration | Peak Users | Goal |
|-----------|--------------|----------|------------|------|
| **Load** | Gradual ramp | Minutes | Normal (50-100) | Validate capacity |
| **Stress** | High sustained | 1-2 hours | Beyond normal (200+) | Find limits |
| **Spike** | Sudden burst | Seconds | Very high (500+) | Handle spikes |
| **Soak** | Steady moderate | Hours/Days | Moderate (50) | Find leaks |

---

## Expected Results Visualization

```
Response Time During Different Tests:

Load Test:
ms  |     _____(stable around 200ms)
200 |____/                            \____
    |------------------------------------>

Stress Test:
ms  |                  _____(degrading to 800ms)
800 |                 /
400 |        ________/
200 |_______/
    |------------------------------------>

Spike Test:
ms  |         ___
600 |        |   |  (brief spike to 600ms)
300 |________|   |____________________
    |------------------------------------>
```

---

## Resources
- [K6 Documentation](https://k6.io/docs/)
- [K6 Examples](https://k6.io/docs/examples/)
- [K6 Test Types](https://k6.io/docs/test-types/introduction/)
