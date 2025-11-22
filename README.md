Project Structure
```
stock-master/
├── backend/                          # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection
│   │   │   ├── env.js               # Environment variables
│   │   │   └── cloudinary.js        # Image upload config 
│   │   ├── models/
│   │   │   ├── User.js              # User authentication
│   │   │   ├── Product.js           # Product master data
│   │   │   ├── Category.js          # Product categories
│   │   │   ├── Warehouse.js         # Warehouse/Location master
│   │   │   ├── Receipt.js           # Incoming stock operations
│   │   │   ├── Delivery.js          # Outgoing stock operations
│   │   │   ├── Transfer.js          # Internal transfers
│   │   │   ├── Adjustment.js        # Stock adjustments
│   │   │   ├── StockLedger.js       # Transaction history
│   │   │   └── ReorderRule.js       # Low stock alerts
│   │   ├── controllers/
│   │   │   ├── authController.js    # Login/signup/OTP
│   │   │   ├── userController.js    # User profile
│   │   │   ├── productController.js # Product CRUD
│   │   │   ├── categoryController.js
│   │   │   ├── warehouseController.js
│   │   │   ├── receiptController.js # Receipt operations
│   │   │   ├── deliveryController.js
│   │   │   ├── transferController.js
│   │   │   ├── adjustmentController.js
│   │   │   ├── dashboardController.js # KPIs & analytics
│   │   │   └── ledgerController.js  # Move history
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   ├── warehouseRoutes.js
│   │   │   ├── receiptRoutes.js
│   │   │   ├── deliveryRoutes.js
│   │   │   ├── transferRoutes.js
│   │   │   ├── adjustmentRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   └── ledgerRoutes.js
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── validateRequest.js   # Input validation
│   │   │   ├── errorHandler.js      # Global error handler
│   │   │   └── roleCheck.js         # Role-based access
│   │   ├── services/
│   │   │   ├── otpService.js        # OTP generation/verification
│   │   │   ├── emailService.js      # Email notifications
│   │   │   ├── stockService.js      # Stock calculation logic
│   │   │   └── reportService.js     # Generate reports
│   │   ├── utils/
│   │   │   ├── validators.js        # Input validators
│   │   │   ├── helpers.js           # Helper functions
│   │   │   └── constants.js         # App constants
│   │   └── app.js                   # Express app setup
│   ├── tests/
│   │   ├── unit/
│   │   └── integration/
│   ├── .env.example
│   ├── package.json
│   └── server.js                    # Entry point
│
├── frontend/                         # React + Vite
│   ├── public/
│   │   └── assets/
│   │       └── images/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── styles/
│   │   │   │   ├── global.css
│   │   │   │   └── variables.css
│   │   │   └── icons/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Alert.jsx
│   │   │   │   └── SearchBar.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   └── OTPVerification.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── KPICard.jsx
│   │   │   │   ├── FilterPanel.jsx
│   │   │   │   ├── RecentActivities.jsx
│   │   │   │   └── StockChart.jsx
│   │   │   ├── products/
│   │   │   │   ├── ProductList.jsx
│   │   │   │   ├── ProductForm.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   └── StockAvailability.jsx
│   │   │   ├── operations/
│   │   │   │   ├── receipts/
│   │   │   │   │   ├── ReceiptList.jsx
│   │   │   │   │   ├── ReceiptForm.jsx
│   │   │   │   │   └── ReceiptDetails.jsx
│   │   │   │   ├── delivery/
│   │   │   │   │   ├── DeliveryList.jsx
│   │   │   │   │   ├── DeliveryForm.jsx
│   │   │   │   │   └── DeliveryDetails.jsx
│   │   │   │   ├── transfer/
│   │   │   │   │   ├── TransferList.jsx
│   │   │   │   │   ├── TransferForm.jsx
│   │   │   │   │   └── TransferDetails.jsx
│   │   │   │   └── adjustment/
│   │   │   │       ├── AdjustmentList.jsx
│   │   │   │       └── AdjustmentForm.jsx
│   │   │   ├── warehouse/
│   │   │   │   ├── WarehouseList.jsx
│   │   │   │   └── WarehouseForm.jsx
│   │   │   └── profile/
│   │   │       └── ProfileCard.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Signup.jsx
│   │   │   │   └── ForgotPassword.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Receipts.jsx
│   │   │   ├── Delivery.jsx
│   │   │   ├── Transfer.jsx
│   │   │   ├── Adjustment.jsx
│   │   │   ├── MoveHistory.jsx
│   │   │   ├── Warehouses.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── NotFound.jsx
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx      # With Sidebar + Navbar
│   │   │   └── AuthLayout.jsx      # Clean layout for login/signup
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # Auth state management
│   │   │   ├── InventoryContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useInventory.js
│   │   │   ├── useDebounce.js
│   │   │   └── useLocalStorage.js
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── receiptService.js
│   │   │   ├── deliveryService.js
│   │   │   ├── transferService.js
│   │   │   ├── adjustmentService.js
│   │   │   └── dashboardService.js
│   │   ├── utils/
│   │   │   ├── formatters.js       # Date, currency formatters
│   │   │   ├── validators.js
│   │   │   └── constants.js
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
│
├── .gitignore
└── README.md
```
