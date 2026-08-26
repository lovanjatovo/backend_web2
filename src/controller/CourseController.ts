import { Request, Response } from "express";
import { CourseService } from "../service/CourseService";

export class CourseController {
    private service = new CourseService();

    getAll = async (req: Request, res: Response) => {
        try {
            const courses = await this.service.getAll();
            return res.status(200).json(courses);
        } catch {
            return res.status(500).json({ message: "Server error" });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const { code, name, description } = req.body;

            if (!code || !name || !description) {
                return res.status(400).json({
                    message: "Code, name and description are required"
                });
            }

            const course = await this.service.create(code, name, description);
            return res.status(201).json(course);
        } catch (error) {
            if (error instanceof Error && (error as any).code === "23505") {
                return res.status(409).json({ message: "Course code already exists" });
            }

            return res.status(500).json({ message: "Server error" });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { code, name, description } = req.body;

            if (!code || !name || !description) {
                return res.status(400).json({
                    message: "Code, name and description are required"
                });
            }

            const course = await this.service.update(id, code, name, description);

            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }

            return res.status(200).json(course);
        } catch (error) {
            if (error instanceof Error && (error as any).code === "23505") {
                return res.status(409).json({ message: "Course code already exists" });
            }

            return res.status(500).json({ message: "Server error" });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const count = await this.service.delete(id);

            if (!count) {
                return res.status(404).json({ message: "Course not found" });
            }

            return res.status(200).json({ message: "Course deleted" });
        } catch {
            return res.status(409).json({ message: "Impossible to delete this course" });
        }
    };
}
