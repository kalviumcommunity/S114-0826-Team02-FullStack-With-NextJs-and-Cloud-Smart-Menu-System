# Low-Level Design (LLD)

## Smart Menu & Inventory Management System

**Source:** Product Requirements Document (PRD) v3\
**Purpose:** Project Assessor Viva Validation

> **Design note:** The PRD defines the modules, APIs, technologies,
> responsibilities, and behavior, but does not specify every concrete
> MongoDB field or source-code class. The detailed structures below are
> an implementation-level design consistent with those stated
> requirements. Exact field names can be adjusted to match the final
> code without changing the architecture.

------------------------------------------------------------------------

## 1. Module Structure

Recommended backend organization:

``` text
backend/
|
+-- controllers/
|   +-- authController
|   +-- menuController
|   +-- inventoryController
|   +-- orderController
|   +-- auditLogController
|
+-- services/
|   +-- authService
|   +-- menuService
|   +-- inventoryService
|   +-- pricingService
|   +-- orderService
|   +-- auditLogService
|
+-- models/
|   +-- User
|   +-- MenuItem
|   +-- Order
|   +-- AuditLog
|
+-- middleware/
|   +-- authMiddleware
|   +-- roleMiddleware
|   +-- rateLimiter
|   +-- requestValidator
|   +-- errorHandler
|
+-- validators/
|   +-- authValidators
|   +-- menuValidators
|   +-- inventoryValidators
|   +-- orderValidators
|
+-- routes/
|   +-- authRoutes
|   +-- menuRoutes
|   +-- orderRoutes
|   +-- auditLogRoutes
|   +-- healthRoutes
|
+-- app/server entry point
```

The exact filenames are implementation choices; the logical services and
middleware are directly derived from the PRD.

## 2. User Model

### Purpose

Stores authenticated application users.

### Logical fields

  Field            Type       Purpose
  ---------------- ---------- ------------------------
  `_id`            ObjectId   Unique user identifier
  `name`           String     Display/user name
  `email`          String     Login identifier
  `passwordHash`   String     bcrypt-hashed password
  `role`           String     `customer` or `owner`
  `createdAt`      Date       Account creation time
  `updatedAt`      Date       Last update time

### Constraints

-   Email should be unique.
-   Password must never be stored in plaintext.
-   Role must be restricted to supported application roles.
-   Password hashing is performed before persistence.

## 3. Menu Item Model

### Purpose

Represents a dish available on the restaurant menu.

### Logical fields

  Field               Type           Purpose
  ------------------- -------------- ----------------------------------
  `_id`               ObjectId       Menu item identifier
  `name`              String         Dish name
  `description`       String         Dish description
  `basePrice`         Number         Default/base price
  `inventory`         Number         Current available quantity
  `isActive`          Boolean        Whether item is active
  `pricingSchedule`   Array/Object   Time-based pricing configuration
  `createdAt`         Date           Creation time
  `updatedAt`         Date           Last update time

The PRD requires menu CRUD, inventory management, and time-based
pricing. These responsibilities can therefore be represented in the
menu-item document.

## 4. Pricing Schedule Design

A pricing schedule represents a price applicable during a defined time
period.

Recommended logical structure:

``` text
pricingSchedule:
[
  {
    startTime: "HH:mm",
    endTime: "HH:mm",
    price: Number
  }
]
```

### Pricing algorithm

``` text
getCurrentPrice(menuItem, currentTime)

1. Read the item's pricing schedules.
2. Find the schedule whose time range contains currentTime.
3. If a matching schedule exists:
       return schedule.price
4. Otherwise:
       return menuItem.basePrice
```

The menu listing endpoint uses this logic so customers see the
live/current price.

### Edge cases

-   No schedule → use base price.
-   No matching schedule → use base price.
-   Multiple overlapping schedules → should be rejected during
    validation or resolved using a documented priority rule.
-   Invalid time range → return validation error.

The PRD requires time-based pricing but does not prescribe the exact
overlap policy; the implementation should choose one and document it.

## 5. Order Model

### Purpose

Stores a customer's successfully created order.

Recommended logical structure:

  Field           Type       Purpose
  --------------- ---------- ---------------------------
  `_id`           ObjectId   Order identifier
  `customerId`    ObjectId   User who placed the order
  `items`         Array      Ordered dishes
  `totalAmount`   Number     Total order amount
  `status`        String     Order state
  `createdAt`     Date       Creation time
  `updatedAt`     Date       Last update

Recommended item structure:

``` text
items:
[
  {
    menuItemId: ObjectId,
    name: String,
    quantity: Number,
    unitPrice: Number,
    subtotal: Number
  }
]
```

Storing the effective unit price in the order preserves the price used
at purchase time even when future pricing schedules change.

### Order status

The PRD requires an order-status update endpoint but does not prescribe
a fixed status enumeration.

A typical implementation may define:

``` text
PLACED
PREPARING
READY
COMPLETED
CANCELLED
```

If the project code uses a different set, the code's set should be
treated as authoritative.

## 6. Audit Log Model

### Purpose

Records menu/inventory modifications and their actor/time/change
details.

Recommended logical structure:

  Field            Type            Purpose
  ---------------- --------------- -------------------------------
  `_id`            ObjectId        Audit record identifier
  `userId`         ObjectId        User who performed the action
  `action`         String          Operation performed
  `resourceType`   String          Menu/inventory resource
  `resourceId`     ObjectId        Affected resource
  `changes`        Object/Object   Changed values
  `timestamp`      Date            When change occurred

Example:

``` text
{
  userId: "...",
  action: "UPDATE",
  resourceType: "menu_item",
  resourceId: "...",
  changes: {
    basePrice: {
      old: 180,
      new: 200
    }
  },
  timestamp: "..."
}
```

The PRD requires audit information covering who, when, and what changed.

## 7. Authentication Logic

### Signup

``` text
POST /api/auth/signup

1. Validate request body.
2. Check whether the email already exists.
3. Hash password with bcrypt.
4. Create user.
5. Return HTTP 201.
```

### Login

``` text
POST /api/auth/login

1. Rate limiter executes.
2. Validate request body.
3. Find user by email.
4. Compare supplied password with bcrypt hash.
5. If invalid -> HTTP 401.
6. Create JWT containing authenticated user identity/role.
7. Return token.
```

### Current user

``` text
GET /api/auth/me

1. authMiddleware verifies JWT.
2. req.user is populated.
3. Retrieve/return current user information.
```

## 8. JWT Design

The token should contain enough information to identify the
authenticated user and support authorization.

Logical payload:

``` text
{
  sub: userId,
  role: userRole
}
```

The token is signed using `JWT_SECRET` and expires according to
`JWT_EXPIRES_IN`.

The PRD requires JWT issuance and verification and role-based
authorization.

## 9. Role Authorization

Example access matrix:

  Operation                         Customer             Owner
  ----------------------------- ------------ -----------------
  Signup/Login                           Yes               Yes
  Browse menu                            Yes               Yes
  Place order                            Yes   No/Not required
  View own orders                        Yes   No/Not required
  Create menu item                        No               Yes
  Update menu item                        No               Yes
  Delete/deactivate menu item             No               Yes
  Configure pricing                       No               Yes
  Restock inventory                       No               Yes
  View audit logs                         No               Yes
  Update order status             Restricted               Yes

The exact route permissions should follow the final implementation, but
owner-only menu/inventory/audit operations are explicitly required by
the PRD.

## 10. Menu API Low-Level Design

### `POST /api/menu`

**Authorization:** Owner

**Processing:**

``` text
Request
  -> authMiddleware
  -> roleMiddleware("owner")
  -> requestValidator
  -> menuController
  -> menuService
  -> MongoDB
  -> auditLogger
  -> 201 Created
```

### `GET /api/menu`

**Authorization:** Customer-facing/public menu access as implemented.

**Processing:**

``` text
Request
  -> menuController
  -> menuService
  -> MongoDB
  -> pricingService
  -> response with current prices
```

### `GET /api/menu/:id`

Retrieves one menu item and applies current pricing logic.

### `PUT /api/menu/:id`

Owner-only update.

The audit hook records the modification.

### `DELETE /api/menu/:id`

Owner-only delete/deactivate operation.

The PRD explicitly allows deletion/deactivation; a soft-delete approach
using `isActive = false` is recommended if historical order references
must remain readable.

### `POST /api/menu/:id/pricing-schedule`

Owner-only pricing configuration.

Processing:

``` text
Validate schedule
      |
Check time/price constraints
      |
Update menu item's schedule
      |
Audit change
      |
Return 201
```

## 11. Inventory API Low-Level Design

### `PATCH /api/menu/:id/inventory`

Owner-only restock/update operation.

Recommended request shape:

``` text
{
  "quantity": 10
}
```

Processing:

``` text
Validate quantity
      |
Find menu item
      |
Increase/update inventory
      |
Create audit record
      |
Return updated item
```

Negative restock quantities should be rejected unless the final project
explicitly supports inventory reductions through this endpoint.

## 12. Order Placement --- Critical LLD

### `POST /api/orders`

This is the most important low-level business operation because it must
solve the race-condition problem.

Recommended processing:

``` text
1. Authenticate customer.
2. Validate order body.
3. For every requested item:
       a. Identify menu item.
       b. Validate that item is active.
       c. Atomically decrement only when inventory >= requested quantity.
4. If any decrement fails:
       return HTTP 409 Conflict.
5. Calculate effective price.
6. Create order.
7. Generate required audit record.
8. Return HTTP 201 Created.
```

### Atomic inventory operation

Conceptual MongoDB operation:

``` javascript
db.menu_items.findOneAndUpdate(
  {
    _id: menuItemId,
    isActive: true,
    inventory: { $gte: requestedQuantity }
  },
  {
    $inc: { inventory: -requestedQuantity }
  },
  {
    returnDocument: "after"
  }
)
```

The key property is the conditional:

``` text
inventory >= requestedQuantity
```

and the decrement happening as one atomic database operation.

### Race-condition example

Starting inventory:

``` text
inventory = 1
```

Two customers simultaneously request quantity `1`.

``` text
Customer A -> atomic condition succeeds -> inventory becomes 0
Customer B -> condition fails -> HTTP 409
```

This prevents the second customer from buying nonexistent inventory.

## 13. Multi-Item Order Consistency

For orders containing multiple menu items, the implementation should
avoid leaving the system partially updated.

Preferred approach:

``` text
Start database transaction/session
       |
       +--> atomic decrement item A
       |
       +--> atomic decrement item B
       |
       +--> create order
       |
       +--> create audit entries
       |
Commit
```

If any required operation fails:

``` text
Rollback
   |
HTTP error
```

If the project implementation does not use MongoDB transactions, this
should be documented honestly in the final implementation notes.

## 14. Order History

### `GET /api/orders`

The service should filter orders by the authenticated customer's
identity.

Conceptually:

``` text
req.user.id
    |
    v
orders.find({ customerId: req.user.id })
```

This prevents one customer from receiving another customer's order
history.

### `GET /api/orders/:id`

The service should verify that the requested order belongs to the
authenticated customer unless the caller has an authorized owner/staff
role.

If the order does not exist:

``` text
404 Not Found
```

## 15. Order Status Update

### `PATCH /api/orders/:id/status`

Processing:

``` text
Authenticate
    |
Check role
    |
Validate new status
    |
Find order
    |
Update status
    |
Return 200
```

Invalid state values should produce a validation error.

The PRD specifically includes role-based authorization and HTTP status
code handling for this endpoint.

## 16. Audit Logging Logic

Audit logging should happen after successful menu/inventory writes.

Conceptual helper:

``` javascript
createAuditLog({
  userId,
  action,
  resourceType,
  resourceId,
  changes,
  timestamp
})
```

Example flow:

``` text
PUT /api/menu/:id
      |
Read old document
      |
Apply update
      |
Write updated document
      |
Create audit log containing old/new values
```

The audit record should identify:

-   Who performed the operation.
-   What resource changed.
-   What operation occurred.
-   What changed.
-   When it happened.

## 17. Audit Summary

### `GET /api/audit-logs/summary`

MongoDB aggregation can produce summary information.

Example logical pipeline:

``` text
audit_logs
   |
   v
$group by user/action
   |
   v
$count / aggregate activity
   |
   v
$sort by activity
   |
   v
summary response
```

The PRD explicitly identifies aggregation pipelines as an optional
rubric item.

## 18. Request Validation

Validation occurs before controllers/services execute.

Examples:

### Signup

``` text
email -> required + valid format
password -> required
name -> required
role -> allowed value if role is accepted during signup
```

### Menu

``` text
name -> required
basePrice -> non-negative number
inventory -> non-negative integer
```

### Inventory

``` text
quantity -> integer
quantity > 0
```

### Order

``` text
items -> required array
menuItemId -> valid identifier
quantity -> positive integer
```

Invalid body:

``` text
HTTP 422
```

The PRD specifically requires request-body validation and maps
validation failures to `422 Unprocessable Entity`.

## 19. Error Handling

All controllers should pass unexpected errors to the centralized Express
error handler.

Conceptual pattern:

``` javascript
try {
  // controller operation
} catch (error) {
  next(error);
}
```

The centralized handler maps known errors:

``` text
ValidationError      -> 422
AuthenticationError  -> 401
AuthorizationError   -> 403
NotFoundError        -> 404
ConflictError        -> 409
RateLimitError       -> 429
UnknownError         -> 500
```

## 20. Frontend Low-Level Design

### Authentication State

The authentication UI maintains state for:

-   Form values
-   Loading state
-   Error state
-   Authenticated user/token

### Menu Page

Typical lifecycle:

``` text
Component mounts
      |
useEffect()
      |
Axios GET /api/menu
      |
setState()
      |
render menu
```

### Order Placement

``` text
User selects quantity
      |
useState updates cart/order state
      |
Submit
      |
async/await Axios POST
      |
       +---- 201 -> success UI
       |
       +---- 409 -> "item no longer available"
       |
       +---- other error -> generic/server error UI
```

The PRD explicitly requires a dedicated error UI for the `409 Conflict`
order case.

### Order History

``` text
Component mounts
      |
useEffect()
      |
GET /api/orders
      |
setOrders()
      |
render order history
```

## 21. JavaScript Concepts Required by the PRD

### Async/Await

The API service layer uses `async/await` rather than `.then()` chains.

Example:

``` javascript
async function getMenu() {
  const response = await axios.get("/api/menu");
  return response.data;
}
```

### Promises vs Callbacks

Axios returns a Promise. The project can demonstrate the contrast with a
short README/code comment showing how a traditional callback-based API
differs.

### Closures

The PRD identifies two examples:

1.  Debounced menu search closing over a timer variable.
2.  A custom `useOrderPolling` hook closing over previous order state.

### Hoisting

`validators.js` can demonstrate function declarations being callable
before their textual definition.

### Event Loop

Order-status polling is an asynchronous, non-blocking task, allowing the
browser UI thread to remain responsive.

## 22. HTTP Response Design

Recommended JSON error shape:

``` json
{
  "error": {
    "code": "INVENTORY_CONFLICT",
    "message": "Requested quantity is no longer available."
  }
}
```

Recommended success shape:

``` json
{
  "data": {}
}
```

The exact response envelope can follow the final implementation; the
important requirement is consistent JSON responses and correct HTTP
status codes.

## 23. Database Indexing

Recommended indexes for the logical model:

``` text
users.email                 -> unique
orders.customerId           -> index
audit_logs.userId           -> index
audit_logs.timestamp        -> index
audit_logs.resourceId      -> index
```

These indexes support common lookup operations required by
authentication, order history, and audit dashboards.

## 24. Environment Configuration

``` text
PORT
MONGO_URI
JWT_SECRET
JWT_EXPIRES_IN
RATE_LIMIT_WINDOW_MS
RATE_LIMIT_MAX
```

Rules:

-   Never commit actual secrets.
-   Keep local secrets in `.env`.
-   Keep `.env` in `.gitignore`.
-   Use deployment-platform secret storage in production.

## 25. API Contract Summary

  Method   Endpoint                           Main Responsibility
  -------- ---------------------------------- ------------------------------
  POST     `/api/auth/signup`                 Register user
  POST     `/api/auth/login`                  Authenticate user
  GET      `/api/auth/me`                     Get current user
  POST     `/api/menu`                        Create menu item
  GET      `/api/menu`                        List menu with live price
  GET      `/api/menu/:id`                    Get menu item
  PUT      `/api/menu/:id`                    Update menu item
  DELETE   `/api/menu/:id`                    Delete/deactivate item
  POST     `/api/menu/:id/pricing-schedule`   Configure pricing
  PATCH    `/api/menu/:id/inventory`          Restock inventory
  POST     `/api/orders`                      Place concurrency-safe order
  GET      `/api/orders`                      List current user's orders
  GET      `/api/orders/:id`                  Get order detail
  PATCH    `/api/orders/:id/status`           Update order status
  GET      `/api/audit-logs`                  View audit logs
  GET      `/api/audit-logs/summary`          Audit aggregation summary
  GET      `/api/health`                      Health check

## 26. Viva-Critical Design Decisions

### Why MongoDB?

The PRD selects MongoDB for CRUD, schema modeling, and
aggregation-pipeline requirements. Relational PK/FK design and SQL JOINs
are explicitly outside the project's scope.

### Why JWT?

JWT provides stateless authentication and allows the backend middleware
to verify the user's identity and role.

### Why bcrypt?

Passwords must not be stored directly. bcrypt provides password hashing
before persistence.

### Why middleware?

Authentication, authorization, rate limiting, validation, error
handling, and audit behavior are cross-cutting concerns and should not
be duplicated in every controller.

### Why atomic inventory update?

A normal read-then-write sequence can suffer a race condition. The
inventory check and decrement must happen atomically so two customers
cannot both purchase the final unit.

### Why HTTP 409?

`409 Conflict` clearly represents the business conflict where another
customer has consumed the requested inventory before the current request
could complete.

### Why audit logs?

They provide traceability: the restaurant owner can determine who
changed what and when.

### Why aggregation?

The audit summary needs grouped/aggregated activity, which is naturally
implemented using MongoDB aggregation pipelines.

## 27. Requirement-to-Design Traceability

  PRD Requirement                 LLD Component
  ------------------------------- --------------------------------------
  Signup/login                    Auth controller/service + User model
  Password hashing                bcrypt in auth service
  JWT                             Auth service + auth middleware
  Role checks                     role middleware
  Menu CRUD                       Menu controller/service/model
  Inventory CRUD                  Inventory controller/service
  Time-based pricing              Pricing service + pricing schedule
  Automatic inventory reduction   Order service
  Concurrent-order safety         Atomic MongoDB update
  HTTP 409 conflict               Order service + error handler
  Order history                   Order service
  Order status                    Order controller/service
  Audit logging                   Audit logger + AuditLog model
  Audit summary                   MongoDB aggregation
  Request validation              requestValidator
  Login rate limiting             rateLimiter
  Centralized errors              errorHandler
  React routing                   React Router
  Async API fetching              Axios + async/await
  React state                     useState
  React side effects              useEffect

## 28. Scope Boundary

Current v1 LLD covers only the features defined in the PRD:

-   Authentication
-   Menu
-   Inventory
-   Pricing
-   Orders
-   Audit logs
-   Concurrency handling
-   Validation
-   Rate limiting
-   Error handling

The following remain outside the current design:

-   Online payments
-   Delivery tracking
-   Reviews/ratings
-   Recommendations
-   Notifications
-   Future staff functionality
-   Future administrator functionality
