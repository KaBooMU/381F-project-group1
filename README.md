Financial Management Application
Group Info
Group Number: 1
Group Members:
Ng Chun Yiu (12893986)
Louie Cheuk Hin (13135675)
Wu Yi Long (13508380)
Project File Introduction
1. server.js
This file is the core of the application, responsible for:

Login/Logout Functionality:
User authentication using sessions.
Registration and login system for new and existing users.
CRUD Web Pages:
Allows users to view, create, update, and delete transactions.
Search transactions by type, description, or amount.
RESTful APIs:
GET /api/transactions: Retrieve all transactions.
POST /api/transactions: Add a new transaction.
PUT /api/transactions/:id: Update a transaction by ID.
DELETE /api/transactions/:id: Delete a transaction by ID.
Integration with MongoDB for database management.

2. package.json
Contains project metadata and dependency information:

Dependencies:
express: Web framework.
ejs: Template engine for dynamic views.
mongoose: MongoDB driver for data management.
body-parser, cookie-session, and method-override: Middleware for handling sessions, form data, and request methods.
Scripts:
Start the server with: npm start or nodemon server.
3. views/login.ejs
Provides the login page UI, allowing users to authenticate and access the system.

4. views/register.ejs
Enables new users to register by providing a username and password.

5. views/transactions.ejs
Displays a dashboard for managing financial transactions, including:

Viewing all transactions.
Adding, updating, or deleting records.
Search functionality.
6. models/
Defines the data schema using Mongoose:

Transaction Schema: Handles transaction records (type, amount, description, date).
User Schema: Manages user authentication (username, password).
Cloud Server URL
The application is hosted at: https://three81f-project-group1.onrender.com
Operation Guide
1. Login/Logout and Registration
Navigate to /register to create a new user account.
Navigate to /login to access the login page.
Use the following test credentials to log in:
Username: test1, Password: test1
Username: test2, Password: test2
After login, users are redirected to the transactions page.
Use the "Logout" button to log out and end the session.
2. CRUD Web Pages
View Transactions: Accessible after login. Displays all transactions in a table format.
Create Transaction: Fill in the form on the transactions page and submit to add a new record.
Update Transaction: Click the "Edit" button next to a transaction to modify its details.
Delete Transaction: Click the "Delete" button next to a transaction to remove it.
3. RESTful CRUD Services
API Endpoints:

GET /api/transactions: Retrieve all transactions.
Example:
curl -X GET "https://three81f-project-group1.onrender.com/api/transactions"

POST /api/transactions: Add a new transaction.
Example:
curl -X POST "https://three81f-project-group1.onrender.com/api/transactions" \
-H "Content-Type: application/json" \
-d '{"type": "income", "amount": 100, "description": "Salary"}'

PUT /api/transactions/:id: Update a transaction.
Example:
curl -X PUT "https://three81f-project-group1.onrender.com/api/transactions/123" \
-H "Content-Type: application/json" \
-d '{"amount": 150}'

DELETE /api/transactions/:id: Delete a transaction.
Example:
curl -X DELETE "https://three81f-project-group1.onrender.com/api/transactions/123"

Notes
Ensure MongoDB is properly configured with your connection URI.
Run the application locally using npm start.
