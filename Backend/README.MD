# Smart Menu Backend

## MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster.
2. In Atlas, create a database user. This is different from your Atlas login.
3. In Atlas Network Access, add your current IP address to the IP access list.
4. In Atlas, open your cluster, choose Connect, then Drivers, then Node.js.
5. Copy the connection string and replace `<db_password>` with the database user's password.
6. Put the connection string in `backend/.env`:

```env
MONGO_URI=mongodb+srv://<db_user>:<db_password>@<cluster-url>/smart_menu?retryWrites=true&w=majority
USE_MEMORY_MONGO=false
```

Keep `.env` private. Do not commit it.

## Run The Backend

```bash
cd backend
npm install
npm start
```

The backend runs on `http://localhost:5000`.

## Run The Seed

The seed script clears users, menu items, orders, and audit logs, then creates demo users and menu items.

```bash
cd backend
npm run seed
```

Default seeded accounts:

```text
Owner: owner@restaurant.com / OwnerPass123!
Customer 1: customer1@gmail.com / CustPass123!
Customer 2: customer2@gmail.com / CustPass123!
```

To customize the seeded owner account, set these in `backend/.env` before running `npm run seed`:

```env
SEED_OWNER_USERNAME=Your Restaurant Owner
SEED_OWNER_EMAIL=owner@example.com
SEED_OWNER_PASSWORD=OwnerPass123!
```

## Create Or Update A Restaurant Owner Account

Use this when you want to add an owner without clearing the whole database:

```bash
cd backend
npm run create-owner -- --username="Restaurant Owner" --email="owner@example.com" --password="OwnerPass123!"
```

You can also set these in `backend/.env` and then run `npm run create-owner`:

```env
OWNER_USERNAME=Restaurant Owner
OWNER_EMAIL=owner@example.com
OWNER_PASSWORD=OwnerPass123!
```

The normal frontend signup page creates customer accounts. Restaurant owner accounts should be created with `npm run seed` or `npm run create-owner`.
