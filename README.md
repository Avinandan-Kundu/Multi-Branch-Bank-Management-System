# 🏦 ✨ Multi-Branch Bank Management System Web App - Setup & Run Guide: ✨ 🏦

👋 Welcome to the Complete Project Setup Guide! This document provides step-by-step instructions to get both the Frontend and Backend running seamlessly. 🚀

⚙️ To run the project, follow both readme instructions below for the frontend and backend. Ensure frontend and backend are both running in separate terminals (run: `npm install` and `npm run dev` in their respective directories) and it should be accessible on Local: `http://localhost:5175/` or any other available ports. 🌐

============================================================================================================================================================
************************************************************************************************************************************************************
============================================================================================================================================================
************************************************************************************************************************************************************

## 🎨 Step by Step Instructions for Setting Up and Running the FRONTEND:

🛠️ Before running this project, make sure the following are installed:

- 🟢 Node.js (LTS recommended)
- 📦 npm (comes with Node.js)
- 💻 VS Code

### 1️⃣ 1) Clone / Open the Project

📂 Open the frontend folder in VS Code.

Folder name:
`Banking_v3`

### 2️⃣ 2) Install Dependencies

⬇️ Open a terminal in the project root and run:

```bash
npm install
```

### 3️⃣ 3) Run the Frontend (Development Mode)

▶️ In the same terminal, run:

```bash
npm run dev
```

👀 You should see output similar to:

```text
VITE v6.x.x ready
Local: http://localhost:5173/
```

⚠️ Note:
If 5173 is already in use, Vite may use another port (for example 5175 or 5176).

### 4️⃣ 4) Open in Browser

🌍 Go to the Local URL shown in terminal, for example:

`http://localhost:5173/`

### 5️⃣ 5) Login / Default Data

💾 This frontend currently uses localStorage (mock/local data), so no backend is required to run it.

🔐 Default admin account:

Email: `admin@bank.com`
Password: `admin`

👥 You can also create customer accounts from the signup pages.

### 6️⃣ 6) Available Frontend Scripts

🏃‍♂️ Run frontend dev server:
```bash
npm run dev
```

🏗️ Create production build:
```bash
npm run build
```

🔍 Preview production build locally:
```bash
npm run preview
```

🧹 Run lint checks:
```bash
npm run lint
```

### 7️⃣ 7) If You Want a Fresh Start (Reset Local Demo Data)

🔄 Because the app stores users/transactions in browser localStorage, you can reset it by:

- 🛠️ Open browser DevTools
- 🗂️ Application (or Storage) tab
- 💾 Local Storage
- 🗑️ Remove keys like: user, users, branches
- 🔄 Refresh the app

### 8️⃣ 8) Frontend Route Overview

- 🏠 `/`                 Home page
- 👤 `/login`            Client login
- 📝 `/signup`           Client signup
- 🛡️ `/admin/login`      Admin login
- ✍️ `/admin/signup`     Admin signup
- 📊 `/customer`         Customer dashboard
- ⚙️ `/admin`            Admin dashboard
- ℹ️ `/account`          Account information page

📝 In short:

This frontend supports:

- 🔑 role-based login (client/admin)
- 💵 customer dashboard (deposit, withdrawal, transaction history)
- 🏢 admin dashboard (branch overview, top-up, transaction monitoring)
- 🌍 EN/FR language toggle
- 🌗 light/dark theme toggle
- 👤 profile menu with account info, dashboard shortcut, and logout
- 💾 localStorage-based session persistence

============================================================================================================================================================
************************************************************************************************************************************************************
============================================================================================================================================================
************************************************************************************************************************************************************

## ⚙️ Step by Step instruction on setting up and running the BACKEND: 

🛠️ Before running this project, make sure the following are installed:

- 🟢 Node.js
- 🐳 Docker Desktop
- 💻 VS Code
- ⚡ Thunder Client extension

### 1️⃣ 1. Clone / Open the Project

📂 Open the backend folder in VS Code.

folder name:

`bank-backend` 

`npm install` 

### 2️⃣ 2. Install Dependencies

⬇️ Open a terminal in the project root and run:

```bash
npm install
```

🧩 If needed, install the required packages manually:

```bash
npm install express mongoose dotenv cors amqplib
npm install nodemon --save-dev 
```

### 3️⃣ 3. Create the Environment File

📄 Create a file named:

`.env`

➕ Add the following:

```env
PORT=5000PORT=5000
MONGO_URI=mongodb+srv://ittehadbinrahman_db_user:pass1234@cluster0.wr5ibfq.mongodb.net/bankDB?retryWrites=true&w=majority&appName=Cluster0
```

### 4️⃣ 4. Start RabbitMQ with Docker

🐳 Open Command Prompt, PowerShell, or a new VS Code terminal and run: 
```bash
docker run -d --hostname rabbit --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

🐇 RabbitMQ Dashboard

🌍 Open in browser:

`http://localhost:15672` 

🔐 Login with:

Username: `guest`
Password: `guest` 

### 5️⃣ 5. Start the Backend Server

▶️ In the project terminal, run:

```bash
npm run dev
```

✅ If everything is working, you should see:

```text
MongoDB connected
RabbitMQ connected
Transaction consumer started
Server running on port 5000 
```

### 6️⃣ 6. How to Test the APIs

⚡ Use Thunder Client inside VS Code.

- 📂 Open Thunder Client
- 🖱️ Click the Thunder Client icon in the left sidebar
- ➕ Click New Request 

________________________API Endpoints___________________

### 🏢 A. Create Branch
**📤 Request**

Method: POST
URL:

`http://localhost:5000/api/branches`

Body
```json
{
  "branchName": "Downtown Branch",
  "location": "Toronto",
  "cashReserve": 50000,
  "staffCount": 10
}
```

### 📋 B. Get All Branches
**📥 Request**

Method: GET
URL:

`http://localhost:5000/api/branches`

### 👤 C. Create Employee
**📤 Request**

Method: POST
URL:

`http://localhost:5000/api/employees`

Body
```json
{
  "name": "John Doe",
  "role": "Manager",
  "branchId": "PASTE_BRANCH_ID_HERE"
}
```

### 👥 D. Get Employees By Branch
**📥 Request**

Method: GET
URL:

`http://localhost:5000/api/employees/branch/PASTE_BRANCH_ID_HERE`

### 💸 E. Create Transaction
**📤 Request**

Method: POST
URL:

`http://localhost:5000/api/transactions`

💵 Deposit Example
```json
{
  "branchId": "PASTE_BRANCH_ID_HERE",
  "customerName": "Charlie",
  "amount": 500,
  "transactionType": "deposit"
}
```

🏧 Withdrawal Example
```json
{
  "branchId": "PASTE_BRANCH_ID_HERE",
  "customerName": "David",
  "amount": 200,
  "transactionType": "withdrawal"
}
```

⚙️ What happens internally
- 🗄️ Transaction is saved to MongoDB
- 🐇 Event is sent to RabbitMQ
- 📥 Consumer receives event
- 🔄 Branch cashReserve is updated asynchronously 

### 📜 F. Get Transactions By Branch
**📥 Request**

Method: GET
URL:

`http://localhost:5000/api/transactions/branch/PASTE_BRANCH_ID_HERE`

### 💰 G. Get Cash Requirement
**📥 Request**

Method: GET
URL:

`http://localhost:5000/api/branches/PASTE_BRANCH_ID_HERE/cash`

🔙 What it returns
- 🆔 branchId
- 👥 employeeCount
- 📊 transactions
- 💵 cashRequired

ℹ️ This is a calculated value based on business logic, not the stored cashReserve.

### 🐇 How to See RabbitMQ Notifications / Messages

👀 There are 2 main places to see RabbitMQ activity:

**1️⃣ Option 1: VS Code Terminal Logs**

💻 After creating a transaction, look at the terminal running:

```bash
npm run dev
```

📝 You should see logs like:

```text
Transaction event sent to RabbitMQ
Received transaction event from RabbitMQ: {
  event: 'transaction_created',
  data: { ... }
}
Branch cashReserve updated asynchronously: { ... }
```

✅ These terminal messages confirm that:

- 📤 the producer sent the event
- 📥 the consumer received the event
- 🗄️ the database was updated

**2️⃣ Option 2: RabbitMQ Dashboard**

🌍 Open:

`http://localhost:15672`

📂 Go to:

Queues and Streams
select the transactions queue if it appears

👀 You can also observe:

- 🔌 Connections
- 📡 Channels
- 🛤️ Queues
- 👥 Consumers

🎯 Expected behavior

✅ When the backend is connected, the dashboard should show at least:

Connections: 1
Channels: 1

✅ When the consumer is active:

Consumers: 1

### 🧪 Full Test Flow

📋 Follow this exact order:

**Step 1**

🐳 Start RabbitMQ:

```bash
docker run -d --hostname rabbit --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

**Step 2**

▶️ Start backend:

```bash
npm run dev
```

**Step 3**

🏢 Create a branch:

POST `http://localhost:5000/api/branches`

**Step 4**

📋 Get branches and copy _id:

GET `http://localhost:5000/api/branches`

**Step 5**

👤 Create an employee using that branchId

**Step 6**

💸 Create a transaction using that same branchId

**Step 7**

👀 Watch terminal logs for RabbitMQ event messages

**Step 8**

▶️ Run:

GET `http://localhost:5000/api/branches`

✅ and verify that cashReserve changed after deposit/withdrawal

**Step 9**

▶️ Run:

GET `http://localhost:5000/api/branches/:id/cash`

✅ to verify cash requirement calculation

**🔍 Example Verification**

⏳ Before deposit
`"cashReserve": 50000`

📤 Send deposit transaction
```json
{
  "branchId": "69cdb62c147146b103e37524",
  "customerName": "Charlie",
  "amount": 500,
  "transactionType": "deposit"
}
```

✅ After deposit
`"cashReserve": 50500`

✅ After withdrawal of 200
`"cashReserve": 50300`

**📝 Notes**
- 💵 cashReserve = actual stored branch cash amount
- 🧮 cashRequired = calculated minimum required reserve based on formula
- 🗄️ MongoDB automatically generates _id
- 🔗 branchId is used to link employees and transactions to a branch 

📝 In short:

This backend supports:

- 🏢 branch management
- 👥 employee management
- 💸 transaction management
- 🧮 dynamic cash requirement calculation
- 🐇 RabbitMQ-based asynchronous transaction processing
- 🔄 automatic branch cash reserve updates through event consumption
