# Assignment - System Design and Analysis: Authentication and Authorization

This repository contains the implementation of a user management API with authentication and authorization features, built as part of the "System Design and Analysis" assignment. The project is divided into four exercises, each focusing on specific aspects of API development, security, and input validation.

## Table of Contents
1. [Exercise 1: Building a User Management API](#exercise-1-building-a-user-management-api)
2. [Exercise 2: Implementing User Authentication](#exercise-2-implementing-user-authentication)
3. [Exercise 3: Adding User Authorization](#exercise-3-adding-user-authorization)
4. [Exercise 4: Input Validation](#exercise-4-input-validation)
5. [Technologies Used](#technologies-used)
6. [Setup Instructions](#setup-instructions)
7. [API Endpoints](#api-endpoints)

---

## Exercise 1: Building a User Management API
A RESTful API for managing users with basic CRUD (Create, Read, Update, Delete) operations.

### Requirements:
- Built using **Express.js**.
- User data (name, email, password) is stored in a temporary global variable `users`.
- CRUD endpoints:
  - `POST /users` - Create a new user.
  - `GET /users` - Retrieve all users.
  - `GET /users/:id` - Retrieve a specific user by ID.
  - `PUT /users/:id` - Update a user's information.
  - `DELETE /users/:id` - Delete a user.

---

## Exercise 2: Implementing User Authentication
Integration of user authentication into the API from Exercise 1.

### Requirements:
- Uses **JSON Web Tokens (JWT)** for authentication.
- Added endpoint:
  - `POST /login` - Authenticate a user and return a JWT token.
- All CRUD endpoints from Exercise 1 now require authentication via JWT.

---

## Exercise 3: Adding User Authorization
Implementation of role-based authorization for users.

### Requirements:
- Users have roles: `"admin"` or `"user"`.
- Middleware to check user roles before performing actions (e.g., updating or deleting users).
- Only `"admin"` users can delete other users via:
  - `DELETE /users/:id`.

---

## Exercise 4: Input Validation
Addition of input validation to ensure data integrity.

### Requirements:
- Uses **express-validator** for input validation on `POST /users` and `PUT /users/:id`.
- Validation rules:
  - Email must be unique and valid.
  - Password must meet a minimum length requirement.

---

## Technologies Used
- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework for building the API.
- **JWT (JSON Web Tokens)**: For user authentication.
- **express-validator**: For input validation.

---

## Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the application**:
   ```bash
   npm start
   ```
4. The API will be available at `http://localhost:3000`.

---

## API Endpoints

| Method   | Endpoint          | Description                        | Authentication | Authorization      |
|----------|-------------------|------------------------------------|----------------|--------------------|
| `POST`   | `/users`          | Create a new user                  | Required       | None               |
| `GET`    | `/users`          | Get all users                      | Required       | None               |
| `GET`    | `/users/:id`      | Get a specific user                | Required       | None               |
| `PUT`    | `/users/:id`      | Update a user                      | Required       | None               |
| `DELETE` | `/users/:id`      | Delete a user                      | Required       | Admin only         |
| `POST`   | `/login`          | Login and receive JWT token        | None           | None               |

### Example Requests
- **Create a user**:
  ```bash
  curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password":"securepass123","role":"user"}'
  ```
- **Login**:
  ```bash
  curl -X POST http://localhost:3000/login -H "Content-Type: application/json" -d '{"email":"john@example.com","password":"securepass123"}'
  ```

---

Feel free to explore the code and test the API using tools like Postman or curl!
