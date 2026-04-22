Full Stack Crypto Dashboard (Demo)

STACK:
- Backend: Node.js + Express + MongoDB
- Frontend: Next.js (React)

FEATURES:
- Auth (JWT)
- KYC with admin approval
- Admin roles (RBAC)
- Transactions (deposit/withdraw)
- Analytics endpoint
- Basic UI (login, dashboard, admin)

SETUP:

BACKEND:
cd server
npm install
Create .env with:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
node server.js

FRONTEND:
cd client
npm install
npm run dev

