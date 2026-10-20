# 🍔 StreetBite — Food Ordering & Management System

<div align="center">

  <h2>🍟 Fresh Food. Easy Ordering. Happy Customers! 🍕</h2>

  <p>
    A full-stack food ordering web application built with React, Node.js,
    Express.js, and MySQL.
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-2026-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-API-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
    <img src="https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
    <img src="https://img.shields.io/badge/Vite-Frontend-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  </p>

  <h3>🛒 Browse • 🥡 Order • 📦 Track • 📊 Manage</h3>

</div>

---

## 📌 Table of Contents

- [🌟 About the Project](#-about-the-project)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Getting Started](#️-getting-started)
- [🗄️ Database Setup](#️-database-setup)
- [🔐 Admin Dashboard](#-admin-dashboard)
- [🔌 API Endpoints](#-api-endpoints)
- [🎨 Design Highlights](#-design-highlights)
- [🔒 Security Notes](#-security-notes)
- [🚀 Future Improvements](#-future-improvements)
- [👩‍💻 Author](#-author)

---

## 🌟 About the Project

**StreetBite** is a full-stack food ordering and management system designed to make online food ordering simple, convenient, and user-friendly.

Customers can explore a menu of food items, search for their favorite dishes, filter items by category, add products to their cart, adjust quantities, and place orders through a checkout form.

The application also includes an **admin login and order management dashboard**, where administrators can view customer orders, monitor sales, search and filter orders, and update order statuses.

The frontend communicates with a Node.js and Express.js backend through REST APIs, while MySQL stores food items, customer orders, and order details.

### 🎯 Project Objectives

- 🛍️ Build a responsive online food ordering experience.
- ⚡ Connect a React frontend to a REST API backend.
- 🗄️ Store food items and order information in a MySQL database.
- 🛒 Implement cart and checkout functionality.
- 📊 Provide an admin dashboard for order management.
- 🔐 Add an admin login flow for dashboard access.

---

## ✨ Features

### 🧑‍🍳 Customer Website

- 🏠 **Attractive Homepage** — A welcoming hero section with food-focused visuals.
- 🍕 **Food Menu** — Displays food items fetched from the backend.
- 🔍 **Search Functionality** — Find food items by name.
- 🏷️ **Category Filters** — Browse food using category buttons.
- 🖼️ **Food Images** — Visual previews for available menu items.
- 🛒 **Shopping Cart** — Add food items and manage the cart.
- ➕ **Quantity Controls** — Increase or decrease item quantities.
- 🗑️ **Remove Items** — Remove unwanted products from the cart.
- 💾 **Cart Persistence** — Retain cart contents using browser local storage.
- 🧾 **Checkout Form** — Collect customer name, phone number, and delivery address.
- 💰 **Order Total** — Calculate the total amount based on ordered items.
- 📩 **Order Submission** — Send order details to the backend.
- ✅ **Order Confirmation** — Display feedback after a successful order.
- ℹ️ **About Section** — Introduce the StreetBite concept.
- ✉️ **Contact Section** — Provide a contact form interface.
- 📱 **Responsive Layout** — Adapt the website to different screen sizes.

### 🛡️ Admin Dashboard

- 🔑 **Admin Login** — Authenticate administrators through a backend API.
- 📦 **View Orders** — Display orders stored in the database.
- 👤 **Customer Details** — View customer names, phone numbers, and addresses.
- 🍔 **Order Items** — View the food items and quantities in each order.
- 💵 **Sales Summary** — Calculate sales from non-cancelled orders.
- ⏳ **Pending Orders** — Count orders awaiting confirmation.
- 🚚 **Delivered Orders** — Track successfully delivered orders.
- 🔎 **Search Orders** — Search using order ID, customer name, or phone number.
- 🏷️ **Filter Orders** — Filter orders by status.
- 🔄 **Refresh Orders** — Fetch the latest order information.
- ✏️ **Update Order Status** — Change an order's status from the dashboard.
- 🗄️ **Database Synchronization** — Save status changes to MySQL through the backend.

### 📋 Supported Order Statuses

| Status | Meaning |
|---|---|
| 🟡 Pending | The order is awaiting confirmation. |
| 🔵 Confirmed | The order has been confirmed. |
| 🟣 Preparing | The order is being prepared. |
| 🟢 Out for Delivery | The order is on its way to the customer. |
| ✅ Delivered | The order has been delivered. |
| 🔴 Cancelled | The order has been cancelled. |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| ⚛️ React | Builds the interactive user interface. |
| ⚡ Vite | Provides the frontend development server and build tools. |
| 🎨 HTML5 | Structures the website content. |
| 🎨 CSS3 | Handles styling, layouts, responsiveness, and animations. |
| 🟢 Node.js | Runs the backend JavaScript application. |
| 🚂 Express.js | Provides REST API endpoints. |
| 🐬 MySQL | Stores food items, orders, and order details. |
| 🔗 mysql2 | Connects the Node.js backend to MySQL. |
| 🔐 JSON Web Token (JWT) | Generates authentication tokens for admin login. |
| 🔑 bcryptjs | Installed as a password-hashing utility. |
| 🌐 CORS | Allows requests between the frontend and backend during development. |
| 📦 npm | Manages project dependencies. |
| 🧰 Git & GitHub | Support version control and source-code hosting. |

> **Note:** Although `bcryptjs` is installed, the current login implementation compares the submitted admin credentials with environment variables directly. It does not yet use bcrypt to hash or verify the password.

---

## 📁 Project Structure

The project is organized into separate frontend and backend applications.

```text
StreetBite/
│
├── frontend/
│   ├── public/
│   │   └── images/
│   │       ├── chat.jpg
│   │       ├── cheeseburger.jpg
│   │       ├── fries.jpg
│   │       ├── hotdog.png
│   │       ├── lit.jpg
│   │       ├── panipuri.jpeg
│   │       ├── pizza.webp
│   │       ├── samosa.jpg
│   │       └── vegburger.jpg
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   ├── .env
│   └── ...
│
├── .gitignore
└── README.md
```

> 📌 This structure is illustrative. Your actual folder contents may differ slightly depending on your current project setup.

---

## ⚙️ Getting Started

Follow these steps to run StreetBite on your local computer.

### 📋 Prerequisites

Make sure you have installed:

- 🟢 [Node.js](https://nodejs.org/)
- 📦 npm, which comes with Node.js
- 🐬 [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- 🧰 [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
- 💻 A code editor such as [Visual Studio Code](https://code.visualstudio.com/)

### 1️⃣ Clone the Repository

If your project is hosted on GitHub, run:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Then navigate into the project directory:

```bash
cd YOUR_PROJECT_FOLDER
```

Replace the example values with your actual repository URL and folder name.

### 2️⃣ Install Frontend Dependencies

Open a terminal in the project root and run:

```bash
cd frontend
npm install
```

### 3️⃣ Install Backend Dependencies

Open a **second terminal** and navigate to the backend folder:

```bash
cd backend
npm install
```

If the authentication packages are not already installed, run:

```bash
npm install bcryptjs jsonwebtoken
```

### 4️⃣ Configure Environment Variables

Create or update `backend/.env`:

```env
PORT=5000

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=streetbite

ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this_to_a_strong_password
JWT_SECRET=replace_with_a_long_random_secret
```

Replace the database values with your own local MySQL configuration.

🔒 **Important:** Use strong, unique admin credentials and a long, random JWT secret. Never upload your `.env` file to GitHub.

The exact environment variable names must match those used in your `backend/db.js` and `backend/server.js` files.

### 5️⃣ Set Up the MySQL Database

Open MySQL Workbench and execute:

```sql
CREATE DATABASE IF NOT EXISTS streetbite;

USE streetbite;
```

The backend expects these tables:

- `foods` — stores food menu items and prices.
- `orders` — stores customer details, totals, status, and order dates.
- `order_items` — stores the food items and quantities associated with each order.

Your backend SQL queries depend on the precise table and column definitions. If you are setting up the database from scratch, create the tables using the schema expected by your current `server.js` and `db.js`, or use your existing database setup.

If your project already has these tables and food items, **you do not need to recreate them**.

To check saved orders:

```sql
USE streetbite;

SELECT *
FROM orders
ORDER BY id DESC;
```

To view the available menu:

```sql
SELECT *
FROM foods;
```

### 6️⃣ Start the Backend Server

In the backend terminal:

```bash
npm run dev
```

The backend should start at:

```text
http://localhost:5000
```

If your project does not have a `dev` script, check `backend/package.json` and use the script defined there.

### 7️⃣ Start the Frontend

In the frontend terminal:

```bash
npm run dev
```

Vite will display a local development URL, usually:

```text
http://localhost:5173
```

Open that address in your browser.

🎉 **StreetBite is now running locally!**

> Keep both frontend and backend terminals running while using the application.

---

## 🗄️ Database Overview

StreetBite uses MySQL for persistent storage.

### 🍔 `foods`

Stores the food items displayed on the customer website.

Typical fields include:

- `id`
- `name`
- `price`
- Image information and any other fields defined in the current schema.

### 📦 `orders`

Stores the main information for each order.

Typical fields include:

- `id`
- `customer_name`
- `phone`
- `address`
- `total_amount`
- `status`
- `created_at`

### 🧾 `order_items`

Connects individual food items to their orders.

Typical fields include:

- `id`, if present in the schema
- `order_id`
- `food_id`
- `quantity`
- `price`

The relationship between these tables allows one order to contain multiple food items.

```text
              ┌─────────────────┐
              │      foods      │
              ├─────────────────┤
              │ id              │
              │ name            │
              │ price           │
              └────────┬────────┘
                       │
                       │ food_id
                       ▼
              ┌─────────────────┐
              │   order_items   │
              ├─────────────────┤
              │ order_id        │
              │ food_id         │
              │ quantity        │
              │ price           │
              └────────┬────────┘
                       │
                       │ order_id
                       ▼
              ┌─────────────────┐
              │      orders     │
              ├─────────────────┤
              │ id              │
              │ customer_name   │
              │ phone           │
              │ address         │
              │ total_amount    │
              │ status          │
              └─────────────────┘
```

*The diagram illustrates the logical relationships; the exact columns and constraints depend on your implemented schema.*

---

## 🔐 Admin Dashboard

StreetBite includes a dedicated admin interface for managing customer orders.

### 🔑 Admin Login

Open the admin login page:

```text
http://localhost:5173/admin-login
```

Enter the credentials configured in your backend `.env` file.

For example, if you configure:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_strong_password
```

Use those values to sign in.

**Do not commit real credentials or JWT secrets to your repository.**

### 📊 Dashboard

After logging in, open:

```text
http://localhost:5173/admin
```

The dashboard provides an overview of customer orders and sales, along with search, filtering, refresh, and order-status controls.

### 🔄 Order Management Workflow

1. A customer browses the food menu.
2. The customer adds food items to the cart.
3. The customer enters delivery information and submits the order.
4. The backend processes the request and saves the order in MySQL.
5. The administrator opens the dashboard to review the order.
6. The administrator updates the order status.
7. The backend saves the new status in MySQL.

> ⚠️ **Security note:** The frontend currently sends a JWT in admin requests. To protect admin data properly, the backend must verify the token before returning orders or accepting status updates. A frontend-only route guard is not sufficient security. Confirm that JWT verification middleware is applied to admin-only backend routes before deploying the application.

---

## 🔌 API Endpoints

The backend exposes REST APIs for communicating with the frontend.

Base URL:

```text
http://localhost:5000
```

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Check whether the backend is running. |
| `GET` | `/api/test-db` | Test the database connection. |
| `GET` | `/api/foods` | Retrieve food menu items. |
| `POST` | `/api/orders` | Create a customer order. |
| `GET` | `/api/orders` | Retrieve orders for the admin dashboard. |
| `PUT` | `/api/orders/:id/status` | Update an order's status. |
| `POST` | `/api/admin/login` | Authenticate an administrator and issue a JWT. |

### 🛒 Example: Create an Order

Request:

```http
POST /api/orders
Content-Type: application/json
```

Example body:

```json
{
  "customer_name": "Alex",
  "phone": "9876543210",
  "address": "Example delivery address",
  "items": [
    {
      "food_id": 1,
      "quantity": 2
    },
    {
      "food_id": 2,
      "quantity": 1
    }
  ]
}
```

The backend should calculate the total using the prices stored in the database rather than trusting a total supplied by the browser.

### 🔄 Example: Update Order Status

Request:

```http
PUT /api/orders/1/status
Content-Type: application/json
Authorization: Bearer YOUR_ADMIN_TOKEN
```

Example body:

```json
{
  "status": "Confirmed"
}
```

The actual authorization behavior depends on the JWT verification middleware configured in the backend.

---

## 🎨 Design Highlights

StreetBite focuses on a clean, food-oriented visual experience.

- 🧡 Warm orange and cream color palette.
- 🍔 Food-focused hero section and imagery.
- 🧩 Card-based food menu layout.
- ✨ Hover effects and interactive buttons.
- 📱 Responsive layouts for smaller screens.
- 🛒 Clear cart and checkout sections.
- 🛡️ A separate interface for administration.
- 📊 Organized order information and dashboard statistics.

---

## 🔒 Security Notes

Security matters even in student projects.

- 🔐 Keep database credentials in environment variables.
- 🚫 Never commit `.env` files to a public repository.
- 🗝️ Use a strong, random JWT secret.
- 👮 Verify JWTs on the backend for admin-only routes.
- 🔒 Validate all customer input on the server.
- 💰 Calculate order totals using trusted database prices.
- 🛡️ Use parameterized SQL queries to reduce SQL injection risk.
- 🚀 Configure production environment variables separately from local development.
- 🔑 Consider using bcrypt to hash and verify administrator passwords.

**Current implementation note:** JWT generation and frontend token storage do not, by themselves, secure the backend APIs. Protecting admin-only endpoints with server-side token verification is necessary before deployment.

---

## 🚀 Future Improvements

Potential enhancements for future versions include:

- 💳 Online payment gateway integration.
- 🔔 Real-time order notifications.
- 👥 Customer accounts and order history.
- 📍 Delivery tracking.
- 📈 Advanced sales analytics and charts.
- 🧾 Downloadable invoices.
- 🥗 More menu categories and food customization.
- 🛡️ Stronger admin authentication and role management.
- ☁️ Cloud deployment for the frontend, backend, and database.
- 🧪 Automated frontend and backend testing.
- 📦 Inventory and stock management.
- 📱 Progressive Web App (PWA) support.

---

## 👩‍💻 Author

**Kashish Jaiswal**

🎓 B.Tech — Computer Science and Engineering  
💻 Interested in Full-Stack Development and Software Engineering



## ⭐ Support

If you find this project interesting, consider giving the repository a ⭐ on GitHub!

Made with ❤️, ☕, and 🍔 by **Kashish Jaiswal**.

### 🍟 StreetBite — Good Food, Great Mood! 🍕
