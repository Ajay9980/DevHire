import express from "express";
import { createTask, getBidsTasks, getMyTasks, getTask, getTaskById, markComplete } from "../controllers/taskController";
import { userMiddleware } from "../middlewares/userMiddleware"; 
const router = express.Router();

router.post("/tasks", userMiddleware,createTask);
router.get('/tasks',getTask)
router.get('/task/:id',getTaskById)
router.get('/task',userMiddleware,getMyTasks)
router.get('/bidtask',userMiddleware,getBidsTasks)
router.post('/markcomplete/:id', userMiddleware , markComplete)

export default router;
