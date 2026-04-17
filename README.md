# 🍽️ Restaurant Management System — Backend

This is the backend API for a restaurant management system that handles orders, payments, real-time updates, and admin operations.

---

## 🚀 Features

* 📦 Order Management (Create, Update, Track)
* 💳 Razorpay Payment Integration (Test Mode)
* 📊 Admin Analytics (Total Orders & Revenue)
* 📡 Real-time Updates using Socket.IO
* 📄 PDF Bill Generation
* 🔐 JWT-based Admin Authentication

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)
* Razorpay SDK
* Socket.IO
* PDFKit
* JWT Authentication

---

## 📂 API Endpoints

### 🧾 Orders

* `POST /api/orders` → Place order
* `GET /api/orders` → Get all orders
* `GET /api/orders/:id` → Get single order
* `GET /api/orders/stats` → Admin stats
* `PATCH /api/orders/:id/status` → Update status
* `GET /api/orders/:id/bill` → Generate PDF

---

### 💳 Payments

* `POST /api/payment/create-order/:orderId`
* `POST /api/payment/verify`

---

### 🔐 Admin

* `POST /api/admin/login`

---

## ⚙️ Environment Variables

Create `.env` file:

```
PORT=5001
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret

RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

---

## ▶️ Running Locally

```bash
npm install
npm run dev
```

---

## 🔗 Frontend Repository

https://github.com/SahilKayasth-16/RestoPro_Frontend
---

## ⚠️ Important Notes

* Razorpay is configured in **Test Mode**
* Payment verification uses signature validation
* Orders emit real-time updates via Socket.IO

---

## 🧠 Future Improvements

* Idempotent payment handling
* Role-based access control
* Logging & monitoring
* Production deployment (Render / Railway)

---

## 👤 Author

Sahil Kayasth
