**Product Requirements Document (PRD) v3**

**Smart Menu & Inventory Management System**

_Prepared for coursework submission · Rubric points covered: 4.8 (3.6 mandatory + 1.2 optional)_

# 1\. Problem Statement

Zomato wants a smart menu where dish inventory auto-decreases when orders come in, and restaurant owners can set time-based pricing. The system must prevent two customers from ordering the last item simultaneously and log every menu change with who made it.

Restaurants often face challenges managing menu inventory, dynamic pricing, and concurrent customer orders. Manual inventory updates can result in overselling, inconsistent pricing, and poor traceability of menu changes. This project builds a smart restaurant menu system that automatically updates inventory after every successful order, supports time-based pricing, prevents multiple customers from purchasing the last available item simultaneously, maintains a complete audit log of all menu modifications, and secures everything behind proper authentication and role checks.

# 2\. Project Goals

### Business Goals

- Reduce manual inventory management.
- Prevent overselling.
- Increase pricing flexibility.
- Improve accountability through audit logging.

### Technical Goals

- Build a scalable full-stack web application (MERN).
- Implement secure authentication and role-based authorization.
- Ensure data consistency during concurrent orders.
- Provide a responsive user interface.
- Follow RESTful API standards and a clean Git workflow.

# 3\. Stakeholders & Users

### Restaurant Owner

- Manage menu items
- Configure pricing schedules
- Restock inventory
- View audit logs
- Monitor customer orders

### Customer

- Browse menu
- View live prices
- Place food orders
- View order history

### Restaurant Staff (Future Scope)

- Process incoming orders
- Update order status

### System Administrator (Future Scope)

- Manage users
- Monitor application health

# 4\. User Stories

### Customer

- As a customer, I want to sign up and log in so my orders are tied to my account.
- As a customer, I want to browse the menu so I can choose dishes.
- As a customer, I want to see the current price based on the time of day.
- As a customer, I want to order only available dishes.
- As a customer, I want my order to fail gracefully if another customer purchases the last available item before me.
- As a customer, I want to view my order history.

### Restaurant Owner

- As a restaurant owner, I want to log in and have my role verified so only I can edit the menu.
- As a restaurant owner, I want to manage menu items.
- As a restaurant owner, I want inventory to automatically decrease after successful orders.
- As a restaurant owner, I want to configure different prices for different time periods.
- As a restaurant owner, I want every menu modification to be recorded with the user and timestamp.
- As a restaurant owner, I want a summary view of audit activity (who changed what, how often).

# 5\. Scope & Workflow

### In Scope

- User Authentication (signup/login, JWT, password hashing, roles)
- Menu Management
- Inventory Management
- Order Placement
- Automatic Inventory Reduction
- Time-based Pricing
- Audit Logging (+ summary reporting)
- Concurrent Order Handling
- Rate limiting & request validation on write endpoints

### Out of Scope (v1)

- Online Payments
- Delivery Tracking
- Reviews & Ratings
- Recommendation Engine
- Notifications

### Workflow

1\. Restaurant Owner logs in

2\. Create / Update Menu

3\. Configure Inventory & Pricing

4\. Customer logs in and browses Menu

5\. Customer places Order

6\. Inventory Validation

7\. Atomic Inventory Update

8\. Order Created

9\. Audit Log Generated

# 6\. Technical Overview

### Proposed Technology Stack

| **Layer**       | **Choice**                 |
| --------------- | -------------------------- |
| Frontend        | React, React Router, Axios |
| Backend         | Node.js, Express.js        |
| Database        | MongoDB                    |
| Authentication  | JWT + bcrypt               |
| Version Control | Git & GitHub               |

### Core Modules

- Authentication Module
- Menu Management Module
- Inventory Management Module
- Pricing Engine
- Order Management Module
- Audit Logging Module

### Major Functionalities

- Secure Login (JWT, hashed passwords)
- Menu CRUD
- Inventory CRUD
- Dynamic Pricing
- Order Processing (concurrency-safe)
- Audit Logs + summary report
- Centralized Error Handling
- Role-based Authorization
- Rate limiting on sensitive routes
- Request body validation

### High-Level System Architecture

```
Customer / Owner (Browser)
      |  HTTPS
      v
React Frontend (Router, Axios, useState/useEffect)
      |  REST API (JSON)
      v
Express Backend
  ├── authMiddleware / roleMiddleware / rateLimiter / requestValidator / errorHandler
  ├── Auth Service
  ├── Menu Service
  ├── Inventory Service
  ├── Pricing Service
  ├── Order Service
  └── Audit Log Service
      |
      v
MongoDB (users, menu_items, orders, audit_logs)
```

# 7\. Features & REST API Endpoints

Each feature lists the rubric skill(s) it demonstrates and the endpoint(s) that implement it.

| **Feature**                    | **Rubric Skill(s) Demonstrated**                                                    | **REST Endpoint(s)**                |
| ------------------------------ | ----------------------------------------------------------------------------------- | ----------------------------------- |
| Signup                         | Password hashing, Request body validation, HTTP status codes                        | POST /api/auth/signup               |
| Login                          | JWT issuance & verification, Rate limiting, HTTP status codes                       | POST /api/auth/login                |
| Get current user               | JWT verification (middleware), Role-based auth                                      | GET /api/auth/me                    |
| Create menu item               | CRUD (Mongo), Schema modeling, RESTful design, Role-based auth                      | POST /api/menu                      |
| List menu (live price)         | CRUD (Mongo), Async data fetching, Problem modeling (pricing)                       | GET /api/menu                       |
| Get menu item                  | CRUD (Mongo), RESTful design                                                        | GET /api/menu/:id                   |
| Update menu item               | CRUD (Mongo), Middleware (audit hook), Role-based auth                              | PUT /api/menu/:id                   |
| Delete/deactivate menu item    | CRUD (Mongo), Role-based auth, HTTP status codes                                    | DELETE /api/menu/:id                |
| Configure time-based pricing   | Problem modeling, System design basics                                              | POST /api/menu/:id/pricing-schedule |
| Restock inventory              | CRUD (Mongo), Role-based auth, Middleware (audit hook)                              | PATCH /api/menu/:id/inventory       |
| Place order (atomic decrement) | Problem modeling (race condition), Server-side error handling, HTTP 409 on conflict | POST /api/orders                    |
| List my orders                 | CRUD (Mongo), Async data fetching                                                   | GET /api/orders                     |
| Get order detail               | CRUD (Mongo), RESTful design                                                        | GET /api/orders/:id                 |
| Update order status            | RESTful design, HTTP status codes, Role-based auth                                  | PATCH /api/orders/:id/status        |
| View audit logs                | CRUD (Mongo), Role-based auth                                                       | GET /api/audit-logs                 |
| Audit summary report           | Aggregation pipelines (Mongo)                                                       | GET /api/audit-logs/summary         |
| Health check                   | System design basics                                                                | GET /api/health                     |

### Frontend Features (React)

| **Feature**                           | **Rubric Skill(s) Demonstrated**                                   | **API Consumed**           |
| ------------------------------------- | ------------------------------------------------------------------ | -------------------------- |
| Login / Signup pages                  | React component composition, useState, Client-side routing         | consumes /api/auth/\*      |
| Customer menu browse page             | useEffect (fetch on mount), Async data fetching, Async/await       | consumes GET /api/menu     |
| Owner dashboard (menu/inventory CRUD) | React component composition, useState/useEffect, Role-gated routes | consumes /api/menu/\*      |
| Order placement flow                  | useState, Async/await, error UI on 409 conflict                    | consumes POST /api/orders  |
| Order history page                    | useEffect, Client-side routing                                     | consumes GET /api/orders   |
| Audit log dashboard                   | React component composition, Async data fetching                   | consumes /api/audit-logs\* |

# 8\. Core JavaScript Concepts — Where They're Demonstrated

Language-level items (0.1 pt each) — call these out in code comments or the README so they're easy to find.

| **Concept**           | **Where It's Demonstrated**                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Async/await           | API client service layer (menuService.js, orderService.js) — every network call uses async/await instead of .then chains.            |
| Promises vs callbacks | Axios wrapper: contrast the Promise-based Axios call with a raw callback-style example in a short comment or README section.         |
| Closures              | Debounced menu-search input (closure over a timer variable) and a custom useOrderPolling hook that closes over previous order state. |
| Hoisting              | validators.js — function declarations (hoisted) used before their definition line, with a comment explaining why.                    |
| Event loop            | README/technical notes explaining why order-status polling runs as a non-blocking async task so the UI thread stays responsive.      |

# 9\. HTTP Status Code Usage

| **Status**                | **When It's Used**                                       |
| ------------------------- | -------------------------------------------------------- |
| 200 OK                    | Successful GET/PATCH/PUT                                 |
| 201 Created               | Successful POST (signup, create menu item, place order)  |
| 400 Bad Request           | Malformed request body                                   |
| 401 Unauthorized          | Missing/invalid JWT                                      |
| 403 Forbidden             | Valid JWT but wrong role                                 |
| 404 Not Found             | Menu item / order / user not found                       |
| 409 Conflict              | Last unit of a dish purchased by another customer first  |
| 422 Unprocessable Entity  | Body fails schema validation                             |
| 429 Too Many Requests     | Rate limiter triggered on /api/auth/login                |
| 500 Internal Server Error | Unhandled exception, caught by centralized error handler |

# 10\. All API Endpoints

### Auth

```
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/me
```

### Menu & Pricing

```
POST /api/menu
GET /api/menu
GET /api/menu/:id
PUT /api/menu/:id
DELETE /api/menu/:id
POST /api/menu/:id/pricing-schedule
```

### Inventory

```
PATCH /api/menu/:id/inventory
```

### Orders

```
POST /api/orders
GET /api/orders
GET /api/orders/:id
PATCH /api/orders/:id/status
```

### Audit Logs

```
GET /api/audit-logs
GET /api/audit-logs/summary
```

### System

```
GET /api/health
```

# 11\. Middleware & Cross-Cutting Concerns

- authMiddleware — verifies JWT, attaches req.user
- roleMiddleware(role) — enforces owner-only / customer-only routes
- rateLimiter — applied to /api/auth/login
- requestValidator(schema) — validates request bodies before controllers run
- errorHandler — centralized Express error-handling middleware; maps errors to correct HTTP status + JSON shape
- auditLogger — internal hook fired on menu/inventory writes to record who/when/what changed

# 12\. Environment Variables & Secrets

| **Variable**                          | **Purpose**                     |
| ------------------------------------- | ------------------------------- |
| PORT                                  | Express server port             |
| MONGO_URI                             | MongoDB connection string       |
| JWT_SECRET                            | Secret used to sign/verify JWTs |
| JWT_EXPIRES_IN                        | Token expiry (e.g. 1d)          |
| RATE_LIMIT_WINDOW_MS / RATE_LIMIT_MAX | Rate limiter config             |

_All secrets live in a git-ignored .env file locally and in the deployment platform's secret manager in production._

# 13\. Risks & Assumptions

### Risks

- Concurrent orders may cause race conditions if not handled correctly.
- Incorrect pricing schedules could affect customer experience.

### Assumptions

- Users have a stable internet connection.
- Restaurant owners maintain accurate inventory.
- All menu changes are performed by authenticated users.

# 14\. Rubric Mapping & Points

Only the rubric items that genuinely fit a MongoDB-based smart menu system are included below. LLM/AI items and the two SQL/Postgres items were dropped as out of scope for this project (no relational data model or AI feature is needed here).

## Mandatory items covered (20 of 25)

| **Rubric Item**                            | **Pts** | **Category**            |
| ------------------------------------------ | ------- | ----------------------- |
| HTTP status codes used correctly           | 0.2     | Backend & System Design |
| Middleware                                 | 0.2     | Backend & System Design |
| Problem modeling                           | 0.2     | Backend & System Design |
| RESTful endpoint design                    | 0.2     | Backend & System Design |
| Server-side error handling                 | 0.2     | Backend & System Design |
| System design basics                       | 0.2     | Backend & System Design |
| Environment variables & secrets management | 0.2     | Engineering Practices   |
| Git workflow                               | 0.3     | Engineering Practices   |
| Async data fetching from API               | 0.2     | Frontend                |
| Client-side routing                        | 0.2     | Frontend                |
| JavaScript — async/await                   | 0.1     | Frontend                |
| JavaScript — Closures                      | 0.1     | Frontend                |
| JavaScript — Event loop                    | 0.1     | Frontend                |
| JavaScript — Hoisting                      | 0.1     | Frontend                |
| JavaScript — Promises vs callbacks         | 0.1     | Frontend                |
| React component composition                | 0.2     | Frontend                |
| Side effects with useEffect                | 0.2     | Frontend                |
| State management with useState             | 0.2     | Frontend                |
| CRUD operations (Mongo)                    | 0.2     | NoSQL (Mongo)           |
| Schema modeling (Mongo)                    | 0.2     | NoSQL (Mongo)           |

**Mandatory covered: 3.6 pts**

_Not used (out of scope — no relational DB or AI feature): LLM API integration (0.2), Prompt engineering (0.2), Structured outputs (0.2), Relational schema design with PK/FK (0.2), SQL JOINs (0.2)._

## Optional items added (a few extras for a solid, secure project)

| **Rubric Item**                 | **Pts** | **Category**            |
| ------------------------------- | ------- | ----------------------- |
| JWT issuance & verification     | 0.2     | Auth & Security         |
| Password hashing                | 0.2     | Auth & Security         |
| Role-based authorization checks | 0.2     | Auth & Security         |
| Rate limiting                   | 0.2     | Auth & Security         |
| Request body validation         | 0.2     | Backend & System Design |
| Aggregation pipelines           | 0.2     | NoSQL (Mongo)           |

**Optional added: 1.2 pts**

**Total: 3.6 (mandatory) + 1.2 (optional) = 4.8 pts**