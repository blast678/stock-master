# ERD / Relationships

- Product 1 - * Stock (product+location unique)
- Location 1 - * Stock
- PurchaseTransaction -> Product, Vendor, Location (IN)
- IssueTransaction -> Product, Location (OUT)
- StockLedger stores per-change ledger entries
- TransactionLog stores unified audit (IN/OUT)
- User is for application users (login handled elsewhere)

Refer to the Excalidraw image in README for UI-to-schema mapping.
