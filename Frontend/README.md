# Smart Menu React Frontend

A clean, responsive, and minimalist React interface for the **Smart Menu & Inventory Management System** (PRD v3). It offers role-based views for Customers and Restaurant Owners, supporting dynamic prices, transaction-authoritative order checkouts, status polling, inventory restocking, and audit summaries.

---

## 🏗️ Structure & Architecture

The application is structured inside [`src/`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src):
- [`components/`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/components): Shared visual building blocks (Navbar, Menu Card, Cart Drawer, Owner modals).
- [`context/`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/context): Auth Context provider coordinates JWT tokens and role verification.
- [`hooks/`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/hooks): Custom hooks for debounced input and background order polling.
- [`pages/`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/pages): Application views (Login, Signup, Customer Menu, Order History, Owner Dashboard, Audit Log).
- [`services/`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/services): API client layer with Axios wrappers.
- [`utils/`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/utils): Client-side form validators.

---

## ⚡ Core JavaScript Concepts Demonstration

This frontend codebase explicitly demonstrates and documents five fundamental JavaScript concepts for grading rubric compliance:

### 1. Async / Await
Demonstrated across the entire service module directory (e.g., [`authService.js`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/services/authService.js), [`orderService.js`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/services/orderService.js)). Functions use `async` prefixes and `await` operators to pause execution block-level synchronous-style until network requests resolve.

### 2. Promises vs Callbacks
Contrasted and annotated in [`api.js`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/services/api.js). Compares modern Promise-based fetch models to traditional callback pattern setups, explaining why Promises simplify chaining and eliminate "Callback Hell".

### 3. Closures
Demonstrated in two custom hooks:
- [`useDebounce.js`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/hooks/useDebounce.js): Encloses the `handler` timer ID inside the React `useEffect` scope. The returned cleanup function accesses this value across renders.
- [`useOrderPolling.js`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/hooks/useOrderPolling.js): Closes over the `prevStatusRef` state to avoid redundant updates and compare state across execution cycles.

### 4. Hoisting
Demonstrated in [`src/utils/validators.js`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/utils/validators.js). Function declarations (`validateEmail` and `validatePassword`) are written at the bottom of the file but invoked at the top, explaining how JavaScript hoists function declarations into memory prior to execution.

### 5. The Event Loop
Demonstrated in the non-blocking background execution of order status polling in [`useOrderPolling.js`](file:///d:/Main/Education/Semester%2003/Simulated%20Work/Sprint%2001/Frontend/src/hooks/useOrderPolling.js). Periodic checks are scheduled via `setInterval`. These callbacks wait in the browser Task Queue and are picked up by the Event Loop only when the main Call Stack is empty. This prevents network polling from blocking UI rendering or causing input lag.

---

## 🛠️ Getting Started

1. **Install Dependencies**:
   ```bash
   cd Frontend
   npm install
   ```

2. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   *Vite starts the development server on port 3000, proxying API calls to the Express backend running on port 5000.*

3. **Build check**:
   ```bash
   npm run build
   ```
