# SADMS – Smart Alcohol Distribution Management System

Academic prototype for **Public Safety, Retail Automation & Digital Governance**

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, React Router, Axios |
| Backend  | Java 17, Spring Boot 3.2, Maven     |
| Database | PostgreSQL                          |
| Auth     | Spring Security + JWT               |

---

## Project Structure

```
SADMS/
├── frontend/        # React + Vite application
└── backend/         # Spring Boot REST API
```

---

## Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.8+
- PostgreSQL 14+

---

## Database Setup

```sql
CREATE DATABASE sadms_db;
```

Update credentials in `backend/src/main/resources/application.properties` if needed:

```properties
spring.datasource.username=postgres
spring.datasource.password=postgres
```

---

## Run the Backend

```bash
cd backend
mvn spring-boot:run
```

Backend starts at: http://localhost:8080

On first run, these demo users are auto-created:

| Username  | Password  | Role     |
|-----------|-----------|----------|
| admin     | admin123  | ADMIN    |
| shop1     | shop123   | SHOP     |
| customer1 | cust123   | CUSTOMER |

---

## Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at: http://localhost:5173

---

## Test the API

```bash
# Health check
curl http://localhost:8080/api/auth/health

# Login as admin
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## Demo Workflow (Final)

```
LOGIN → VERIFY CUSTOMER → CHECK LIMIT → SELL PRODUCT
     → GENERATE BILL → UPDATE STOCK → VIEW ADMIN DASHBOARD
```

---

## Phases

| Phase | Feature                    | Status      |
|-------|----------------------------|-------------|
| 1     | Project Setup              | Complete    |
| 2     | Login + Role Routing       | Complete    |
| 3     | Customer Module            | Complete    |
| 4     | Mock Identity Verification | Complete    |
| 5     | RFID/NFC Simulation        | Complete    |
| 6     | Purchase Module            | Complete    |
| 7     | Government Wine Shop Module| Complete    |
| 8     | Inventory Module           | Complete    |
| 9     | Digital Billing            | Complete    |
| 10    | Admin Module               | Complete    |
| 11    | Reports                    | Complete    |
