import { Request, Response } from "express";
import { QuestionService } from "../service/QuestionService";

export class QuestionController {
    private service = new QuestionService();
    getForAdmin = async (req: Request, res: Response) => {
        try {
            const questions = await this.service.getQuestionsForAdmin(Number(req.params.id));
            return res.status(200).json(questions);
        } catch (error) {
            if (error instanceof Error && error.message === "EXAM_NOT_FOUND") {
                return res.status(404).json({ message: "Exam not found" });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    getForStudent = async (req: Request, res: Response) => {
        try {
            const exam = await this.service.getQuestionsForStudent(Number(req.params.id), req.user!.userId);
            return res.status(200).json(exam);
        } catch (error) {
            if (error instanceof Error && error.message === "EXAM_NOT_FOUND") {
                return res.status(404).json({ message: "Exam not found"});
            }

            if (error instanceof Error && error.message === "EXAM_NOT_AVAILABLE" ) {
                return res.status(403).json({message: "Exam is not available"});
            }

            if (error instanceof Error && error.message === "ALREADY_ATTEMPTED") {
                return res.status(409).json({ message: "You have already attempted this exam" });
            }

            return res.status(500).json({ message: "Internal server error" });
        }
    };

    create = async (req: Request, res: Response) => {
        try {
            const { statement, points, choices } = req.body;

            if (!statement || !Array.isArray(choices)) {
                return res.status(400).json({ message: "Statement and choices are required" });
            }

            const question = await this.service.createQuestion(
                Number(req.params.id),
                statement,
                points ?? 1,
                choices
            );

            return res.status(201).json(question);
        } catch (error) {
            if (error instanceof Error && error.message === "INVALID_CHOICES_COUNT") {
                return res.status(400).json({ message: "A question must have between 2 and 6 choices" });
            }

            if (error instanceof Error && error.message === "INVALID_CORRECT_CHOICE") {
                return res.status(400).json({ message: "A question must have exactly one correct choice" });
            }

            if (error instanceof Error && error.message === "EXAM_LOCKED") {
                return res.status(409).json({ message: "This exam is locked because it already has an attempt" });
            }

            if (error instanceof Error && error.message === "EXAM_NOT_FOUND") {
                return res.status(404).json({ message: "Exam not found" });
            }

            return res.status(500).json({ message: "Internal server error" });
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);
            const { statement, points, choices } = req.body;

            if (!statement || !Array.isArray(choices) || choices.length === 0) {
                return res.status(400).json({
                    message: "Statement and choices are required"
                });
            }
            const question = await this.service.updateQuestion(
                id,
                statement,
                points ?? 1,
                choices
            );
            if (!question) {
                return res.status(404).json({ message: "Question not found"});
            }
            return res.status(200).json(question);

        } catch (error) {
            if (error instanceof Error && error.message === "INVALID_CHOICES_COUNT") {
                return res.status(400).json({
                    message: "A question must have between 2 and 6 choices"
                });
            }

            if (error instanceof Error && error.message === "INVALID_CORRECT_CHOICE") {
                return res.status(400).json({
                    message: "A question must have exactly one correct choice"
                });
            }

            if (error instanceof Error && error.message === "EXAM_LOCKED") {
                return res.status(409).json({ message: "This exam is locked because it already has an attempt" });
            }

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const count = await this.service.deleteQuestion(Number(req.params.id));
            if (!count) return res.status(404).json({ message: "Question not found" });
            return res.status(200).json({ message: "Question deleted successfully" });

        }  catch (error) {
            if (error instanceof Error && error.message === "EXAM_LOCKED") {
                return res.status(409).json({message: "This exam is locked because it already has an attempt"});
            }

            return res.status(500).json({
                message: "Internal server error"
            });
        }
    };
}