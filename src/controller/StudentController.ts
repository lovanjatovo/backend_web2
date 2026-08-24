import { Request, Response } from "express";
import { StudentService } from "../service/StudentService";

export class StudentController {

    private studentService =
        new StudentService();

    create = async (
        req: Request,
        res: Response
    ) => {

        try {

            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Email and password required" });
            }

            const student = await this.studentService.createStudent( email, password );

            return res.status(201).json({
                id: student.id,
                email: student.email,
                role: student.role,
                isActive: student.isActive
            });

        } catch (error) {
            if (error instanceof Error && error.message === "EMAIL_EXISTS" ) {
                return res.status(409).json({message: "This email already exists" });
            }
            return res.status(500).json({ message: "Server error"});
        }
    };

    getAll = async ( req: Request, res: Response) => {
        try {
            const students = await this.studentService.getStudents();
            return res.status(200).json(
                students.map(student => ({
                    id: student.id,
                    email: student.email,
                    role: student.role,
                    isActive: student.isActive
                }))
            );

        } catch {return res.status(500).json({message: "Server error"}); }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ message: "Email required" });
            }

            const student = await this.studentService.updateStudent(id, email);
            return res.status(200).json({
                id: student?.id,
                email: student?.email,
                role: student?.role,
                isActive: student?.isActive
            });

        } catch (error) {
            if ( error instanceof Error && error.message === "NOT_FOUND") {
                return res.status(404).json({ message: "Student not found"});
            }
            return res.status(500).json({
                message: "Server error"
            });
        }
    };

    deactivate = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            await this.studentService.deactivateStudent(id);
            return res.status(200).json({
                message: "Student deactivated"
            });

        } catch {
            return res.status(404).json({ message: "Student not found"});
        }
    };
}