# StockMaster Backend (Generated)

This repo contains a complete Express + Mongoose backend for your StockMaster app.

**What is included**
- Models: User, Vendor, Location, Product, PurchaseTransaction, IssueTransaction, Stock, StockLedger, TransactionLog
- Controllers + Routes (CRUD)
- Stock service that updates Stock, StockLedger and TransactionLog on purchases/issues
- Seed script to create sample data
- Config for MongoDB connection

**How to use**
1. copy `.env.example` to `.env` and set `MONGO_URI`
2. `npm install`
3. `npm run seed` (to insert sample data)
4. `npm start`

**Reference Excalidraw exported image (uploaded by you):**
`/mnt/data/StockMaster - 8 hours.png`

