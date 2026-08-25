import express from "express";
import dotenv from "dotenv";

import { corsConfig } from "./configuration/cors";
import { authMiddleware } from "./security/authMiddleware";
import { roleMiddleware } from "./security/roleMiddleware";

import { AuthController } from "./controller/AuthController"; 
import { StudentController } from "./controller/StudentController"; 
import { CourseController } from "./controller/CourseController"; 
import { ExamController } from "./controller/ExamController"; 
import { QuestionController } from "./controller/QuestionController"; 
import { ResultController } from "./controller/ResultController"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(corsConfig);
app.use(express.json());

// Controllers 
const authController = new AuthController(); 
const studentController = new StudentController(); 
const courseController = new CourseController(); 
const examController = new ExamController(); 
const questionController = new QuestionController(); 
const resultController = new ResultController(); 
 
app.post("/api/auth/login", authController.login); 

// STUDENTS - ADMIN 
app.get("/api/students", authMiddleware, roleMiddleware("ADMIN"), studentController.getAll); 
app.post("/api/students", authMiddleware, roleMiddleware("ADMIN"), studentController.create); 
app.put("/api/students/:id", authMiddleware, roleMiddleware("ADMIN"), studentController.update); 
app.delete("/api/students/:id", authMiddleware, roleMiddleware("ADMIN"), studentController.deactivate);

// COURSES - ADMIN 
app.get("/api/courses", authMiddleware, roleMiddleware("ADMIN"), courseController.getAll); 
app.post("/api/courses", authMiddleware, roleMiddleware("ADMIN"), courseController.create); 
app.put("/api/courses/:id", authMiddleware, roleMiddleware("ADMIN"), courseController.update); 
app.delete("/api/courses/:id", authMiddleware, roleMiddleware("ADMIN"), courseController.delete); 

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});