# Authentication System

A secure **User Authentication System** implemented using **Node.js, Express, MongoDB, and bcrypt**.
This project focuses on building **secure Signup and Login APIs** with **password hashing and strict input validation**.

---

# 📌 Assignment

**WDC Club Induction**

**Task:**
Implement secure Signup and Login APIs using:

* Secure password hashing (`bcrypt`)
* Strict input validation

---

# 🚀 Features

* User Registration (Signup API)
* User Login API
* Secure Password Hashing using **bcrypt**
* Input Validation using **express-validator**
* Strict Request Body Validation
* JWT Token Generation after login
* Cookie-based authentication
* MongoDB database integration

---

# 🔐 Security Implementation

### Password Hashing

Passwords are never stored in plain text.
Before saving a user, the password is hashed using **bcrypt**.

Example:

```
bcrypt.hash(password, 10)
```

During login, passwords are verified using:

```
bcrypt.compare(password, user.password)
```

---

### Input Validation

User inputs are validated using **express-validator**.

Validation rules include:

* Name must be **3–30 characters**
* Phone number must contain **10 digits**
* Email must be **valid format**
* Password must:

  * be **6–20 characters**
  * contain **at least one capital letter**
  * contain **at least one number**

---

### Strict Body Validation

The project uses a **strict body middleware** to reject unknown fields.

Example:

```
Unknown fields: age, role
```

This prevents **malicious data injection**.

---

# 📂 Project Structure

```
project/
│
├── config/
│   └── dbconnector.js
│
├── models/
│   └── user.models.js
│
├── middleware/
│   ├── validate.js
│   ├── strictBody.js
│   └── protect.js
│
├── validators/
│   └── authValidator.js
│
├── utils/
│   ├── emailBody.js
│   ├── tokenGenerator.js
│   └── sendEmail.js
│
├── Routes/
│   └── authRoutes.js
│
├── public/
│   └── frontend pages
│
├── .env
├── server.js
└── README.md
```

---

# 🛠 Technologies Used

* **Node.js**
* **Express.js**
* **MongoDB**
* **bcrypt**
* **express-validator**
* **JWT**
* **cookie-parser**

---

# 📡 API Endpoints

## Signup

Creates a new user account.

```
POST /api/auth/register
```

Example request:

```
{
  "fullname": "Madhukar Kumar",
  "email": "mkrmadhukar@gmail.com",
  "phone": "9876543210",
  "password": "123456ABC"
}
```

---

## Login

Authenticates a user and returns a token.

```
POST /api/auth/login
```

Example request:

```
{
  "email": "mkrmadhukar@gmail.com",
  "password": "123456ABC"
}
```

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```
MONGO_URI= *mongoDB url*
PORT=3000
EMAIL_USER=*email for nodemailer*
EMAIL_PASS_KEY=*email passkey for nodemailer*
JWT_SECRET=*jwt_secret_code*
CLIENT_URL =http://localhost:3000/
JWT_REFRESH_SECRET=*jwt_refresh_code*

```

---

# 💻 Running the Project

### Install dependencies

```
npm install
```

### Start server

```
npm start
```

Server will run at:

```
http://localhost:3000
```

---

# 📌 Author

**Madhukar Kumar**

WDC Club Induction – Backend Assignment

---

# ⭐ Conclusion

This project demonstrates a **secure authentication system** with **password hashing, strict validation, and secure login mechanisms**.
It follows **best practices for backend authentication systems used in real-world applications**.
