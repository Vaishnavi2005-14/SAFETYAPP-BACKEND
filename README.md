# Shtree Kavach - Safety App Backend

This is the backend service for Shtree Kavach. It provides a RESTful API built on Node.js and Express, using MongoDB for persistent storage of user credentials, profiles, and custom emergency contact networks.

---

## 1. Tech Stack & Dependencies

- **Node.js & Express**: Fast, lightweight framework for routing and JSON API endpoints.
- **MongoDB & Mongoose**: Object Data Modeling (ODM) library for schema definition and query validation.
- **jsonwebtoken (JWT)**: Generates and verifies cryptographic bearer tokens for secure requests.
- **bcryptjs**: Blowfish-based password hashing algorithm to securely hash passwords before database storage.
- **cors**: Middleware to allow cross-origin resource sharing, enabling communication from Android Emulators, iOS simulators, and real devices.
- **dotenv**: Loads configuration variables from .env into environment processes.

---

## 2. Directory Structure

```
backend/
│
├── .env                      # Configuration file containing port, database URI, and secret key
├── .gitignore                # Tells Git to ignore node_modules and .env files
├── package.json              # Project script runner and dependency declarations
├── server.js                 # Entry point, connects MongoDB, configures routes, starts server
│
├── middleware/
│   └── auth.js               # Verifies JWT Authorization headers
│
├── models/
│   └── User.js               # User, Profile, and Contact schema definitions
│
└── controllers/
    ├── authController.js     # Controller code for login and signup operations
    └── userController.js     # Controller code for fetching/saving profiles and contacts
```

---

## 3. Database Schema (models/User.js)

The MongoDB user schema consists of three sub-structures:

### 1. Contact Schema
Represents a guardian contact:
- name (String, required)
- phone (String, required)

### 2. Profile Schema
Represents user personal details and safety configurations:
- name (String, default: empty string)
- age (String, default: empty string)
- phone (String, default: empty string)
- aadhaar (String, default: empty string)
- customMessage (String, default: Standard distress message)
- shakeEnabled (Boolean, default: true)
- shakeSensitivity (String, default: "Medium")

### 3. User Schema
The parent collection document:
- email (String, unique index, required)
- password (String, hashed, required)
- profile (Profile schema, default: nested object with default settings)
- contacts (Array of Contact schemas, default: prefilled with national emergency numbers)

---

## 4. API Endpoints

### Authentication (/api/auth)

#### 1. POST /api/auth/signup
- **Purpose**: Registers a new user.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: Returns JWT token and default user object.

#### 2. POST /api/auth/login
- **Purpose**: Authenticates credentials.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: Returns JWT token and synced user document.

---

### User Settings (/api/user)
All endpoints below require a valid bearer token in the HTTP Header:
`Authorization: Bearer <JWT_STRING>`

#### 1. GET /api/user/data
- **Purpose**: Retrieves the authenticated user's profile and contacts.
- **Response**: JSON user object (excluding the hashed password).

#### 2. PUT /api/user/profile
- **Purpose**: Updates profile settings.
- **Request Body**: JSON containing key-value updates:
  ```json
  {
    "name": "Jane Doe",
    "shakeSensitivity": "High"
  }
  ```
- **Response**: Confirmation message and updated profile object.

#### 3. PUT /api/user/contacts
- **Purpose**: Overwrites the user's list of custom guardian contacts.
- **Request Body**:
  ```json
  {
    "contacts": [
      { "name": "Dad", "phone": "9876543210" },
      { "name": "Mom", "phone": "8765432109" }
    ]
  }
  ```
- **Response**: Confirmation message and updated contacts array.

---

## 5. How to Run the Server Local Setup

1. Clone or download this directory into a folder named `safetyapp-backend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root with:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/safeher
   JWT_SECRET=SafeHerSuperSecretJWTKey123
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Ensure your MongoDB local daemon is running.
