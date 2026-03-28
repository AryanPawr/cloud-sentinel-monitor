// Centralised in-memory store.
// Swap these arrays with DB calls in your service layer when ready.

const services = [
  { id: 1, name: "Auth Service", status: "UP", responseTime: 42, region: "us-east-1", type: "API" },
  { id: 2, name: "Payment Gateway", status: "UP", responseTime: 118, region: "us-west-2", type: "API" },
  { id: 3, name: "User Database", status: "DOWN", responseTime: null, region: "eu-west-1", type: "Database" },
  { id: 4, name: "Storage Service", status: "UP", responseTime: 210, region: "ap-southeast-1", type: "Storage" },
  { id: 5, name: "CDN Node-04", status: "UP", responseTime: 15, region: "global", type: "CDN" },
];

const alerts = [
  {
    id: 1,
    service: "User Database",
    severity: "P1",
    title: "Connection pool exhausted",
    status: "Open",
    duration: "1h 22m",
    timestamp: new Date(Date.now() - 5000000).toISOString(),
  },
  {
    id: 2,
    service: "Payment Gateway",
    severity: "P1",
    title: "5xx Errors on /checkout",
    status: "Open",
    duration: "4m",
    timestamp: new Date().toISOString(),
  },
  {
    id: 3,
    service: "Auth Service",
    severity: "P2",
    title: "High Latency in Login Flow",
    status: "Open",
    duration: "15m",
    timestamp: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 4,
    service: "Storage Service",
    severity: "P3",
    title: "Disk usage above 85%",
    status: "Open",
    duration: "3d",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 5,
    service: "CDN Node-04",
    severity: "P2",
    title: "Cache invalidation timeout",
    status: "Open",
    duration: "45m",
    timestamp: new Date(Date.now() - 2700000).toISOString(),
  }
];

module.exports = { services, alerts };