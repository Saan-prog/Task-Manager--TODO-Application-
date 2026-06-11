# Task Manager — Frontend

React frontend for the Task Manager app. Built with Vite and Tailwind CSS.
Connects to the Node.js + Express backend for all data.

---

## What's inside

- React 18 + Vite
- Tailwind CSS for styling
- React Router DOM for navigation
- Axios for API calls
- Context API for auth state

# folder structure
src/
├── assets/              # Static assets (images, fonts, etc.)
├── components/          
│   └── ProtectedRoutes.jsx  # Route protection component
├── context/             # React Context for state management
│   ├── AuthContext.jsx      # Authentication state
├── pages/              
│   ├── Dashboard.jsx   # Main todo dashboard
│   ├── Login.jsx       # Login page
│   └── Register.jsx    # Registration page
├── services/           # API service layer
│   ├── api.js          # Axios configuration
├── App.jsx             # Main app component
├── index.css           # Global styles (Tailwind)
├── main.jsx            # Application entry point
├── .env                # Environment variables
├── .gitignore          # Git ignore file
├── eslint.config.js    # ESLint configuration
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── vite.config.js      # Vite configuration
└── README.md           # Project documentation

---

## Setup

1. Clone the repo and go into the client folder
```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager/client
```

2. Install packages
```bash
   npm install
```

3. Create your `.env` file
```bash
   cp .env.example .env
```
   Open `.env` and add your backend URL:
   VITE_API_URL=http://localhost:8090/api

   4. Make sure your backend is running first, then start the frontend
```bash
   npm run dev
```
   Runs on `http://localhost:5173`

---

## Environment variables
VITE_API_URL=http://localhost:5000/api

After deployment update this to the live Render backend URL.

## Pages

| Page | Route | Protected |
|------|-------|-----------|
| Register | `/register` | No |
| Login | `/login` | No |
| Dashboard | `/dashboard` | Yes |

`ProtectedRoutes.jsx` handles route protection — if you are not logged in
and try to access the dashboard it redirects you to `/login` automatically.

---
## Features

- Register, login, logout
- Create, edit, delete tasks
- Mark tasks as Pending or Completed
- Filter tasks by status
- Search tasks by title
- Pagination
- Form validation
- Fully responsive on mobile and desktop

---

## How API calls work

All requests go through `services/api.js`. It creates an Axios instance
with the base URL from `.env` and automatically attaches the JWT token
to every request so you never have to set headers manually in your components:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

Import `api` anywhere in your components:
```javascript
import api from '../services/api';

const response = await api.get('/tasks');
const response = await api.post('/tasks', taskData);
const response = await api.put(`/tasks/${id}`, taskData);
const response = await api.delete(`/tasks/${id}`);
```

---

## Auth flow

1. User registers or logs in
2. Backend returns a JWT token
3. Token is saved to `localStorage`
4. `AuthContext` reads the token and sets the logged in state
5. Every API request after that automatically includes the token via the Axios interceptor
6. On logout the token is removed from `localStorage` and the user is redirected to `/login`

---

## Scripts

```bash
npm run dev        # start development server
npm run build      # build for production
npm run preview    # preview production build locally
```

---

## Common issues

**CORS error**
Make sure your backend has CORS enabled and `VITE_API_URL` in `.env`
matches the exact port your backend runs on — usually `5000`.

**Token not persisting after refresh**
Check that the token is being saved to `localStorage` after login
and that `AuthContext` reads from `localStorage` when the app loads.

**Page shows 404 on refresh after deployment**
Add a `_redirects` file inside `client/public/`:
/*    /index.html   200
This tells Render to always serve `index.html` so React Router
can handle the routing on the client side.

**API calls failing after deployment**
Make sure `VITE_API_URL` in Render environment variables points to
your live backend URL, not `localhost`.

---

## Deployment

See the root [README.md](../README.md) for full deployment steps on Render.

---

Built by Sandra — MERN Stack Developer

