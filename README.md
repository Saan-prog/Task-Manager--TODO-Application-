# Task Manager App

A full stack task management app.
Users can register, log in, and manage their daily tasks — create, update, delete, track status, filter and search the tasks.

---

## What this project does

- Register and log in with JWT authentication
- Add tasks with a title, description, due date and status
- Edit or delete tasks
- Mark tasks as Pending or Completed
- Filter tasks by status
- Search tasks by title
- Pagination on the task list

---

## Tech stack

**Frontend** — React.js, Vite, Tailwind CSS, Axios, React Router DOM

**Backend** — Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt

---

## Project structure
task-manager/
├── client/        # React frontend
├── server/        # Node.js + Express backend
└── README.md


Each folder has its own README with setup instructions:
- [Backend README](./server/README.md)
- [Frontend README](./client/README.md)

---

## Running locally

You need to run both frontend and backend at the same time.

**Backend**
```bash
cd server
npm install
cp .env.example .env
# fill in your MONGO_URI, JWT_SECRET and PORT in .env
npm run dev
```
Runs on `http://localhost:5000`

**Frontend**
```bash
cd client
npm install
cp .env.example .env
# set VITE_API_URL=http://localhost:5000/api in .env
npm run dev
```
Runs on `http://localhost:5173`

---

## Deployment on Render

Both are deployed separately on Render.

### Backend — Web Service

1. Go to Render → New → **Web Service**
2. Connect your GitHub repo
3. Fill in build settings:
Root Directory:  server
Build Command:   npm install
Start Command:   npm start
4. Add these environment variables:
PORT=5000
NODE_ENV=production
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
5. Deploy and copy the backend URL

---

### Frontend — Static Site

1. Go to Render → New → **Static Site**
2. Connect your GitHub repo
3. Fill in build settings:
Root Directory:    client
Build Command:     npm run build
Publish Directory: dist
4. Add environment variable:
VITE_API_URL=https://your-backend-name.onrender.com/api
5. Deploy

---

### Two things to do after both are deployed

1. Add a `_redirects` file inside `client/public/` so page refresh works:
/*    /index.html   200

2. Update CORS in `server/index.js` to allow your frontend URL:
```javascript
   app.use(cors({
     origin: "https://your-frontend-name.onrender.com"
   }));
```
   Then redeploy the backend.

---

## Live links

- Frontend: `https://your-frontend-name.onrender.com`
- Backend API: `https://your-backend-name.onrender.com/api`

---

  ## Demo
   
   https://user-images.githubusercontent.com/your-id/your-video.mp4

---

Built by Sandra — MERN Stack Intern at Skill Haara