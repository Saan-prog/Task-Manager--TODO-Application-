import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";


dotenv.config();
connectDB();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// middilewares
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use("/api", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/test", (req, res) => {
    res.send("Test... API running")
});
app.use(errorHandler);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server ruuning on port ${PORT}`);
});