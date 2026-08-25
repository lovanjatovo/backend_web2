import { Request, Response } from "express";
import { CourseService } from "../service/CourseService";

export class CourseController {

    private service = new CourseService();

    getAll = async (req: Request, res: Response) => {
        const courses = await this.service.getAll();
        res.status(200).json(courses);
    };

    create = async (req: Request, res: Response) => {
        try {
            const { name, description } = req.body;
            if (!name || !description) { 
                return res.status(400).json({message: "Name and description required"});
            }
            const course = await this.service.create(name, description);
            return res.status(201).json(course);

        } catch {
            return res.status(500).json({message: "Server error"});
        }
    };

    update = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { name, description } = req.body;
        const course = await this.service.update(id, name, description);
        if (!course) {return res.status(404).json({message: "Course not found"})}
        res.status(200).json(course);
    };

    delete = async ( req: Request, res: Response) => {
        const id = Number(req.params.id);
        try {
            const count= await this.service.delete(id);
            if (!count) { return res.status(404).json({message: "Course not found"})}
            res.status(200).json({message: "Course deleted"});

        } catch {
            return res.status(409).json({ message:"Impossible to delete this course" });
        }
    };
}