#  Cloud Sentinel: High-Availability Reliability Monitor

**Cloud Sentinel** is a full-stack SRE (Site Reliability Engineering) platform designed to monitor distributed microservices, track real-time telemetry, and manage the incident response lifecycle. It is built with a focus on **Security-by-Design** and **System Resilience**.

##  Key Features

###  Reliability & Observability (SRE)
- **Service Health Tracking:** Real-time monitoring of API, Database, and CDN nodes.
- **Incident Lifecycle:** Integrated P1/P2/P3 alerting system with "Resolve" and "Delete" workflows.
- **Latency Visualization:** Dynamic response-time bars for identifying performance bottlenecks.
- **Stateless Architecture:** Designed for horizontal scaling and cloud-native deployment.

###  Cybersecurity & Hardening
- **JWT-Protected Telemetry:** All API routes are hardened with JSON Web Token (JWT) authentication.
- **Role-Based Access Simulation:** Secure login flow with encrypted credential handling.
- **Sanitized Data Flow:** Protection against common injection vectors in service management.
- **Audit Trails:** Timestamps and duration tracking for all system incidents.

##  Tech Stack
- **Frontend:** React, Tailwind CSS (Custom Dark-Minimalist Cyberpunk Aesthetic).
- **Backend:** Node.js, Express.js.
- **Security:** JWT (JSON Web Tokens), Axios Interceptors.
- **Infrastructure:** In-memory high-speed store (Ready for MongoDB/PostgreSQL migration).

##  SRE Testing Roadmap
1. [ ] **Chaos Engineering:** Implement latency injection to test frontend skeleton states.
2. [ ] **Dockerization:** Containerize with `docker-compose` for environment parity.
3. [ ] **Load Testing:** Stress test the `/alerts` endpoint using k6.
4. [ ] **CI/CD:** GitHub Actions for automated security scanning (Snyk/CodeQL).

##  Getting Started
1. Clone the repo: `git clone https://github.com/AryanPawr/cloud-sentinel-monitor.git`
2. Install dependencies: `npm install` (in both root and backend).
3. Start the engine: `npm run dev`.
