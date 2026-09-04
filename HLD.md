# High-Level Design (HLD)

## Smart Menu & Inventory Management System

**Source:** Product Requirements Document (PRD) v3\
**Purpose:** Project Assessor Viva Validation

------------------------------------------------------------------------

## 1. System Overview

The Smart Menu & Inventory Management System is a full-stack web
application for restaurant menu, inventory, pricing, order,
authentication, and audit management.

The system is designed around the following core requirements:

-   Automatically reduce dish inventory after successful orders.
-   Prevent overselling when multiple customers attempt to purchase the
    last available unit.
-   Support time-based pricing.
-   Record menu and inventory modifications in an audit log.
-   Secure operations with JWT authentication and role-based
    authorization.
-   Provide a responsive React frontend and RESTful Express backend.
-   Validate write requests, rate-limit sensitive routes, and centrally
    handle errors.

The PRD specifies the stack as React/React Router/Axios,
Node.js/Express.js, MongoDB, JWT + bcrypt, and Git/GitHub.

## 2. Architecture Style

The application follows a layered client-server architecture:

``` text
+---------------------------+
|       User Browser        |
|   Customer / Restaurant   |
|          Owner            |
+-------------+-------------+
              |
             HTTPS
              |
              v
+---------------------------+
|      React Frontend       |
| React Router | Axios      |
| useState | useEffect      |
+-------------+-------------+
              |
          REST / JSON
              |
              v
+------------------------------------------------+
|              Express Backend                   |
|                                                |
| authMiddleware / roleMiddleware                |
| rateLimiter / requestValidator / errorHandler  |
|                                                |
| Auth Service                                  |
| Menu Service                                  |
| Inventory Service                             |
| Pricing Service                               |
| Order Service                                 |
| Audit Log Service                             |
+----------------------+-------------------------+
                       |
                       v
+------------------------------------------------+
|                   MongoDB                      |
| users | menu_items | orders | audit_logs       |
+------------------------------------------------+
```

The architecture shown in the PRD on page 3--4 separates the React
client, REST API, Express services/middleware, and MongoDB persistence
layer.

## 3. Major Components

### 3.1 Frontend

Technology:

-   React
-   React Router
-   Axios
-   `useState`
-   `useEffect`

Main UI areas:

1.  Login / Signup
2.  Customer Menu Browse
3.  Owner Dashboard
4.  Order Placement
5.  Order History
6.  Audit Log Dashboard

The frontend communicates with the backend exclusively through REST APIs
returning JSON.

### 3.2 Backend

Technology:

-   Node.js
-   Express.js

The backend is responsible for:

-   Authentication and authorization
-   Menu CRUD
-   Inventory operations
-   Dynamic pricing
-   Order processing
-   Concurrency-safe inventory decrement
-   Audit logging
-   Validation
-   Rate limiting
-   Error handling

### 3.3 Database

Technology:

-   MongoDB

The PRD identifies four primary logical collections:

``` text
users
menu_items
orders
audit_logs
```

MongoDB is used for CRUD operations, schema modeling, and aggregation
pipelines for the audit summary.

## 4. Backend Service Architecture

### Authentication Service

Responsibilities:

-   User signup
-   Password hashing using bcrypt
-   User login
-   JWT issuance
-   Current-user retrieval

Endpoints:

-   `POST /api/auth/signup`
-   `POST /api/auth/login`
-   `GET /api/auth/me`

### Menu Service

Responsibilities:

-   Create menu items
-   List menu items
-   Retrieve a menu item
-   Update menu items
-   Delete/deactivate menu items
-   Expose the current price through the pricing logic

Endpoints:

-   `POST /api/menu`
-   `GET /api/menu`
-   `GET /api/menu/:id`
-   `PUT /api/menu/:id`
-   `DELETE /api/menu/:id`

### Pricing Service

Responsibilities:

-   Store pricing schedules
-   Determine the applicable price for a menu item based on the current
    time
-   Make the live/current price available when the menu is requested

Endpoint:

-   `POST /api/menu/:id/pricing-schedule`

### Inventory Service

Responsibilities:

-   Restock inventory
-   Validate available quantity
-   Perform inventory reduction as part of order processing

Endpoint:

-   `PATCH /api/menu/:id/inventory`

### Order Service

Responsibilities:

-   Create orders
-   Validate availability
-   Atomically decrement inventory
-   Return HTTP 409 when another customer obtains the last available
    item first
-   Retrieve customer order history
-   Retrieve order details
-   Update order status

Endpoints:

-   `POST /api/orders`
-   `GET /api/orders`
-   `GET /api/orders/:id`
-   `PATCH /api/orders/:id/status`

### Audit Log Service

Responsibilities:

-   Record who changed menu/inventory data
-   Record when the change occurred
-   Record what was changed
-   Provide audit-log listing
-   Produce an audit summary using MongoDB aggregation

Endpoints:

-   `GET /api/audit-logs`
-   `GET /api/audit-logs/summary`

## 5. Cross-Cutting Middleware

The backend uses common middleware around service/controller operations.

### Authentication Middleware

`authMiddleware`

-   Verifies the JWT.
-   Attaches authenticated user information to `req.user`.
-   Rejects missing or invalid authentication.

### Role Middleware

`roleMiddleware(role)`

-   Checks the authenticated user's role.
-   Enforces owner-only/customer-only access where required.
-   Prevents authenticated users with the wrong role from performing
    restricted actions.

### Rate Limiter

`rateLimiter`

Applied to the login endpoint to reduce abuse and excessive
authentication attempts.

### Request Validator

`requestValidator(schema)`

Validates request bodies before the request reaches the
controller/service logic.

Invalid request bodies result in HTTP `422 Unprocessable Entity`
according to the PRD.

### Error Handler

`errorHandler`

Centralizes Express error handling and converts application errors into
the required HTTP status code and JSON response shape.

### Audit Logger

`auditLogger`

An internal hook for menu/inventory write operations that records:

-   User responsible for the change
-   Time of the change
-   What changed

## 6. Request Flow

### 6.1 Customer Menu Flow

``` text
Customer
   |
   v
React Menu Page
   |
   | GET /api/menu
   v
Express
   |
   v
Menu Service
   |
   +--> Pricing Service
   |
   v
MongoDB
   |
   v
Menu + current price
   |
   v
React UI
```

### 6.2 Owner Menu Update Flow

``` text
Owner
  |
  v
React Owner Dashboard
  |
  | PUT /api/menu/:id
  v
authMiddleware
  |
roleMiddleware(owner)
  |
requestValidator
  |
Menu Service
  |
MongoDB
  |
auditLogger
  |
Response
```

### 6.3 Order Placement Flow

The PRD explicitly defines this sequence:

``` text
Customer Login
      |
      v
Browse Menu
      |
      v
Place Order
      |
      v
Inventory Validation
      |
      v
Atomic Inventory Update
      |
      +---- conflict ----> HTTP 409
      |
      v
Order Created
      |
      v
Audit Log Generated
```

The atomic inventory operation is the key concurrency-safety mechanism.
If two customers attempt to purchase the last unit, only the request
that successfully satisfies the inventory condition may proceed. The
other request fails gracefully with HTTP `409 Conflict`.

## 7. Concurrency Design

The major concurrency risk is overselling.

Unsafe approach:

``` text
Customer A reads stock = 1
Customer B reads stock = 1
A decrements -> 0
B decrements -> -1
```

The system instead requires an atomic inventory update so that the
availability check and decrement occur as one database operation.

Conceptually:

``` text
UPDATE inventory only if available quantity >= requested quantity
                    |
             +------+------+
             |             |
          success        failure
             |             |
       create order     HTTP 409
```

MongoDB's atomic document update capability is used to implement this
design.

## 8. Data Architecture

The four primary logical collections are:

``` text
users
menu_items
orders
audit_logs
```

Logical relationships:

``` text
User
 | \
 |  \ creates
 |   \
 |    +----> Orders
 |
 +----> Audit Logs

Menu Item
 |
 +----> Orders / ordered items
 |
 +----> Audit Logs
```

MongoDB is intentionally used instead of a relational PK/FK model
because the PRD explicitly excludes relational schema design and SQL
JOINs from this project.

## 9. Security Architecture

Security controls specified by the PRD:

-   Password hashing with bcrypt
-   JWT authentication
-   JWT verification middleware
-   Role-based authorization
-   Request body validation
-   Login rate limiting
-   Environment variables for secrets
-   Git-ignored local `.env`
-   Production secrets stored in the deployment platform's secret
    manager

Important environment variables:

  Variable                 Purpose
  ------------------------ ------------------------------
  `PORT`                   Express server port
  `MONGO_URI`              MongoDB connection string
  `JWT_SECRET`             JWT signing/verifying secret
  `JWT_EXPIRES_IN`         JWT expiration
  `RATE_LIMIT_WINDOW_MS`   Rate limiter window
  `RATE_LIMIT_MAX`         Rate limiter maximum

## 10. API Organization

  Domain           Endpoints
  ---------------- ---------------------------
  Authentication   `/api/auth/*`
  Menu & Pricing   `/api/menu/*`
  Inventory        `/api/menu/:id/inventory`
  Orders           `/api/orders/*`
  Audit Logs       `/api/audit-logs*`
  System           `/api/health`

The complete endpoint set is defined in the PRD pages 4--6.

## 11. HTTP Error Architecture

The API uses meaningful status codes:

  Status   Meaning
  -------- -------------------------------------
  200      Successful GET/PATCH/PUT
  201      Successful POST / resource creation
  400      Malformed request
  401      Missing/invalid JWT
  403      Valid JWT but incorrect role
  404      Resource not found
  409      Inventory concurrency conflict
  422      Request schema validation failure
  429      Rate limiter triggered
  500      Unhandled server error

## 12. Frontend Architecture

The React application uses component composition and client-side
routing.

``` text
React Application
|
+-- Authentication Pages
|   +-- Login
|   +-- Signup
|
+-- Customer
|   +-- Menu
|   +-- Order Placement
|   +-- Order History
|
+-- Owner
    +-- Dashboard
    +-- Menu CRUD
    +-- Inventory
    +-- Pricing
    +-- Audit Logs
```

Role-gated routes prevent users from reaching pages that require a
different role.

The PRD also calls out:

-   `useState` for component/application state.
-   `useEffect` for API-fetch side effects.
-   `async/await` for asynchronous API calls.
-   Client-side routing using React Router.

## 13. Audit Reporting Architecture

Audit records are persisted in MongoDB.

The audit summary endpoint:

``` text
GET /api/audit-logs/summary
```

uses a MongoDB aggregation pipeline to summarize audit activity, such as
who changed what and how often.

``` text
Audit Logs
    |
    v
MongoDB Aggregation Pipeline
    |
    +--> group by user/action/etc.
    |
    v
Summary JSON
    |
    v
Audit Dashboard
```

## 14. Availability and Error Handling

The system is expected to fail gracefully.

Examples:

-   Invalid login → `401`
-   Wrong role → `403`
-   Missing menu item → `404`
-   Concurrent last-item purchase → `409`
-   Invalid body → `422`
-   Excessive login requests → `429`
-   Unexpected backend exception → `500`

This keeps business errors distinguishable from server failures.

## 15. Deployment / Configuration Boundary

Configuration and secrets are kept outside source code.

``` text
Development
    |
    +--> .env (git-ignored)

Production
    |
    +--> Deployment platform secret manager
```

The source repository should contain code and configuration templates,
not actual secret values.

## 16. Future Scope Boundary

The PRD explicitly leaves these features outside v1:

-   Online payments
-   Delivery tracking
-   Reviews and ratings
-   Recommendation engine
-   Notifications
-   Restaurant staff functionality
-   System administrator functionality

The HLD therefore does not require architecture for these features in
the current release.
