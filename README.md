# 🚲 RickTrack — Rickshaw Ride Tracking App (MERN Stack)

RickTrack is a **full-stack MERN application** designed to track rickshaw rides in **Mirpur DOHS** using the **unique number printed on rickshaw pullers’ orange jackets**.

The app allows users to log daily rides, track repeated rickshaw numbers, and analyze ride patterns.  
It supports **multi-user authentication**, **role-based authorization**, and **secure session handling** using JWT.

---

## ✨ Features

### 👤 User Features
- Register & Login (JWT Authentication)
- Add daily rickshaw rides
- Track:
  - Rickshaw number
  - Trip type (Home → Office / Office → Home)
  - Total rides
  - Repeat count
  - Last ride date
- Edit **only their own rides**
- Secure logout

### 👑 Admin Features
- Login as admin
- View **all rides of all users**
- See which user added which ride
- Edit **any user’s ride data**

### 🔐 Security
- Password hashing with bcrypt
- JWT authentication
- Tokens stored in database (session-based JWT)
- Role-based access control (admin / user)
- Backend-enforced data isolation

---

## 🧠 Tech Stack

### Frontend
- React (Vite)
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs

---

## 📂 Project Structure

```

RickTrack/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md

````

---

## 🔑 Authentication Flow

1. User registers with email & password
2. Password is hashed and stored in MongoDB
3. On login:
   - JWT is generated
   - Token is stored in DB (session)
   - Token, role, and userId are returned
4. Token is sent with every request
5. Backend verifies:
   - Token validity
   - Session existence
   - User role
6. Logout deletes token from DB and browser

---

## 🛠️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd RickTrack
````

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start backend server:

```bash
npm run dev
```

Backend will run on:

```
http://localhost:5001
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🧪 API Endpoints (Protected)

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/logout`

### Rides

* `POST /api/ride` → Add ride
* `GET /api/rickshaws` → User: own rides | Admin: all rides
* `PUT /api/rickshaw/:id` → Edit ride (role-based)

---

## 🧑‍⚖️ Role Rules

| Role  | View Own | View All | Edit Own | Edit All |
| ----- | -------- | -------- | -------- | -------- |
| User  | ✅        | ❌        | ✅        | ❌        |
| Admin | ✅        | ✅        | ✅        | ✅        |

---

## 📌 Key Design Decisions

* **Ride ownership enforced in backend**
* **Hooks-safe React architecture**
* **No early returns before hooks**
* **Session-based JWT (logout works properly)**
* **Admin privileges enforced server-side**

---

## 🚀 Future Improvements

* Full ride history view
* Filters by date & user
* Export data (CSV)
* Admin dashboard
* PWA conversion (offline support)
* Analytics & charts

---

## 👨‍💻 Author

**Shakera Jannat Ema**
Intern Software Engineer, ShellBeeHaken Ltd.
Hands-on MERN Stack Practice Project

---

## 📜 License

This project is for **learning and demonstration purposes**.

```

---

If you want, I can also:
- Add **screenshots section**
- Add **API documentation**
- Write a **deployment guide**
- Convert this into a **portfolio-ready README**

Just tell me 👍
```
