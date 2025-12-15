/* Characteristics:
Tests beyond normal capacity (e.g., 200+ users)
Identifies system limits and breaking points
Checks how system fails and recovers
Goal: Find maximum capacity before failure
Example: Black Friday sale might spike to 500+ users - will your system survive?
 */

import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 }, // Ramp-up to 10 users over 10 seconds
    { duration: "30s", target: 20 }, // Steady-state at 20 users for 30 seconds
    { duration: "10s", target: 0}, // Ramp-down to 0 users over 10 seconds
  ],
};

export default function () {
  const res=http.get("https://quickpizza.grafana.com/test.k6.io");
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
}
