import { Request, Response } from "express";
import { StudentService } from "../service/StudentService";

export class StudentController {
    private studentService = new StudentService();

    create = async (req: Request, res: Response) => {
        try {
            const { firstName, lastName, email, password } = req.body;

            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({
                    message: "First name, last name, email and password are required"
                });
            }

            const student = await this.studentService.createStudent(
                firstName,
                lastName,
                email,
                password
            );

            return res.status(201).json({
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                role: student.role,
                isActive: student.isActive
            });
        } catch (error) {
            if (error instanceof Error && error.message === "EMAIL_EXISTS") {
                return res.status(409).json({
                    message: "This email already exists"
                });
            }

            return res.status(500).json({ message: "Server error" });
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const students = await this.studentService.getStudents();

            return res.status(200).json(
                students.map((student) => ({
                    id: student.id,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    email: student.email,
                    role: student.role,
                    isActive: student.isActive
                }))
            );
        } catch {
            return res.status(500).json({ message: "Server error" });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { firstName, lastName, email, isActive } = req.body;

            if (!firstName || !lastName || !email) {
                return res.status(400).json({
                    message: "First name, last name and email are required"
                });
            }

            const student = await this.studentService.updateStudent(
                id,
                firstName,
                lastName,
                email,
                typeof isActive === "boolean" ? isActive : undefined
            );

            return res.status(200).json({
                id: student?.id,
                firstName: student?.firstName,
                lastName: student?.lastName,
                email: student?.email,
                role: student?.role,
                isActive: student?.isActive
            });
        } catch (error) {
            if (error instanceof Error && error.message === "NOT_FOUND") {
                return res.status(404).json({ message: "Student not found" });
            }

            return res.status(500).json({ message: "Server error" });
        }
    };

    deactivate = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const student = await this.studentService.deactivateStudent(id);

            return res.status(200).json({
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                role: student.role,
                isActive: student.isActive
            });
        } catch {
            return res.status(404).json({ message: "Student not found" });
        }
    };
}
