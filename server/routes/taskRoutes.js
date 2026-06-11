import express from 'express';
import {
    createTask, getTasks, getTaskbyId, updateTask,
    updateStatus, deleteTask
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js"



const router = express.Router();

router.post("/add", protect, createTask);
router.get("/allPosts", protect, getTasks);
router.get("/:id", protect, getTaskbyId);
router.put("/update/:id", protect, updateTask);
router.patch("/statusUpdate/:id", protect, updateStatus);
router.delete("/remove/:id", protect, deleteTask);


export default router;

