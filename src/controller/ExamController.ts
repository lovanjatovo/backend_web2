import { Request, Response } from "express";
import { ExamService } from "../service/ExamService";

export class ExamController {
    private service = new ExamService();
    getAll = async (req: Request, res: Response) => {
        try {
            const exams = await this.service.getAll();
            return res.status(200).json(exams);
        } catch {
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    getById = async (req: Request, res: Response) => {
        try {
            const exam = await this.service.getById(Number(req.params.id));
            if (!exam) return res.status(404).json({ message: "Exam not found" });
            return res.status(200).json(exam);
        } catch {
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    getAvailable = async (req: Request, res: Response) => {
        try {
            const exams = await this.service.getAvailable(req.user!.userId);
            return res.status(200).json(exams);
        } catch {
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const { courseId, name, startDate, endDate } = req.body;
            if (!courseId || !name || !startDate || !endDate) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const exam = await this.service.create(courseId, name, startDate, endDate);
            return res.status(201).json(exam);
        } catch (error) {
            if (error instanceof Error && error.message === "INVALID_DATES") {
                return res.status(400).json({ message: "End date must be after start date" });
            }
            if (error instanceof Error && error.message === "COURSE_NOT_FOUND") {
                return res.status(400).json({ message: "Course not found" });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const { courseId, name, startDate, endDate } = req.body;
            if (!courseId || !name || !startDate || !endDate) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const exam = await this.service.update(Number(req.params.id), courseId, name, startDate, endDate);
            if (!exam) return res.status(404).json({ message: "Exam not found" });
            return res.status(200).json(exam);
        } catch (error) {
            if (error instanceof Error && error.message === "INVALID_DATES") {
                return res.status(400).json({ message: "End date must be after start date" });
            }

            if (error instanceof Error && error.message === "EXAM_LOCKED") {
                return res.status(409).json({ message: "This exam cannot be modified because it already has an attempt" });
            }

            if (error instanceof Error && error.message === "COURSE_NOT_FOUND") {
                return res.status(400).json({ message: "Course not found" });
            }

            return res.status(500).json({ message: "Internal server error" });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const count = await this.service.delete(Number(req.params.id));
            if (!count) return res.status(404).json({ message: "Exam not found" });
            return res.status(200).json({ message: "Exam deleted successfully" });
            
        } catch (error) {
            if (error instanceof Error && error.message === "EXAM_LOCKED") {
                return res.status(409).json({ message: "This exam cannot be deleted because it already has an attempt" });
            }

            return res.status(500).json({ message: "Internal server error" });
        }
    };
}