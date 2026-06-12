# Shtree Kavach - Safety App Backend

This is the backend service for Shtree Kavach. It provides a RESTful API built on Node.js and Express, connected to MongoDB Atlas for cloud storage of user credentials, profiles, and custom emergency contact networks, and is ready for deployment on Railway.

---

## 1. Tech Stack & Dependencies

- **Node.js & Express**: Fast, lightweight framework for routing and JSON API endpoints.
- **MongoDB Atlas**: Fully-managed cloud database service for persistent, scalable user and contact storage.
- **Mongoose**: Object Data Modeling (ODM) library for database schema definition and validation.
- **google-auth-library**: Google APIs client library for Node.js, used to verify Google OAuth ID Tokens securely.
- **jsonwebtoken (JWT)**: Generates and verifies cryptographic bearer tokens for secure user sessions.
- **bcryptjs**: Password hashing algorithm to securely store user credentials.
- **cors**: Middleware to enable cross-origin resource sharing.
- **dotenv**: Loads configuration variables from the environment.

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
    ├── authController.js     # Controller code for login, signup, and google auth operations
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

#### 3. POST /api/auth/google
- **Purpose**: Validates a Google OAuth ID Token and logs/registers the user.
- **Request Body**:
  ```json
  {
    "idToken": "GOOGLE_ID_TOKEN_HERE"
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

## 5. Deployment & Configuration

### Cloud Database (MongoDB Atlas)
1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster.
3. Add a database user with read/write access.
4. Set Network Access to allow access from any IP address (`0.0.0.0/0`) since Railway uses dynamic IP hosting.
5. Copy the connection string. It will look like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/safeher?retryWrites=true&w=majority`

### Cloud Hosting (Railway)
1. Sign up on [Railway](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your `SAFETYAPP-BACKEND` repository.
4. Under **Variables**, add the following environment variables:
   - `PORT`: 5000 (or let Railway assign it dynamically)
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure private key for JWT signing
5. Click **Deploy**. Railway will build the Node app and generate a public subdomain (e.g. `https://xxx.up.railway.app`) which you will use as `baseUrl` in your Flutter frontend.

### Local Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root with:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/safeher?retryWrites=true&w=majority
   JWT_SECRET=SafeHerSuperSecretJWTKey123
   ```
4. Start the server:
   ```bash
   npm start
   ```
