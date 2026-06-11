# Task Manager — Backend

Node.js + Express REST API with MongoDB. Handles auth and task management.

---

## What's inside

- Node.js + Express.js
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing
- Global error handling middleware

---

## Folder structure
server/
├── config/
│   └── db.js
├── controllers/
│   ├── taskController.js
│   └── user.js
├── middleware/
│   ├── Auth.js
│   └── errorHandler.js
├── models/
│   ├── Task.js
│   └── User.js
├── routes/
│   ├── taskRoutes.js
│   └── userRoutes.js
├── utility/
│   └── generateToken.js
├── .env.example
├── .gitignore
└── index.js

---

## Setup

1. Clone the repo and go into the server folder
```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager/server
```

2. Install packages
```bash
   npm install
```

3. Create your `.env` file
```bash
   cp .env.example .env
```
   Open `.env` and fill in your values — MongoDB URI, JWT secret, port.

4. Run the server
```bash
   npm run dev
```
   Runs on `http://localhost:5000`

---

## Environment variables

Create a `.env` file using `.env.example` as the template:
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

---

## API reference

### Auth — no token needed
POST /api/users/register
```json
{
  "name": "Sandra",
  "email": "sandra@example.com",
  "password": "123456"
}
```
POST /api/users/login
```json
{
  "email": "sandra@example.com",
  "password": "123456"
}
```

Both return the user object with a JWT token.

---

### Tasks — token required

Add this to every request header:
Authorization: Bearer <your_token>

GET    /api/tasks                   get all my tasks
GET    /api/tasks?status=Pending    filter by status
GET    /api/tasks/:id               get one task
POST   /api/tasks                   create a task
PUT    /api/tasks/:id               update a task
PATCH  /api/tasks/:id/status        update status only
DELETE /api/tasks/:id               delete a task

Task body:
```json
{
  "title": "Complete assignment",
  "description": "Finish the MERN task manager",
  "status": "Pending",
  "dueDate": "2024-12-31"
}
```

- `status` accepts `Pending` or `Completed` only
- `dueDate` is optional — past dates are rejected on create but allowed on update
- to clear a due date send `"dueDate": null`
- tasks come back sorted newest first

---

## Validations

**User**
- name — required, 3 to 50 characters
- email — required, unique, valid format
- password — required, minimum 6 characters, never returned in responses

**Task**
- title — required, 3 to 50 characters
- description — optional, max 300 characters
- status — Pending or Completed, defaults to Pending
- dueDate — optional, no past dates on create

---

## Error responses

All errors come back in this shape:

```json
{
  "message": "what went wrong",
  "stack": "only visible in development"
}
```

Common codes:
- `400` — missing or invalid fields
- `401` — wrong credentials or missing token
- `404` — task not found
- `500` — something broke on the server

---

## Scripts

```bash
npm start      # run normally
npm run dev    # run with nodemon
```

---

## Deployment

See the root [README.md](../README.md) for full deployment steps on Render.

---

Built by Sandra — MERN Stack Developer