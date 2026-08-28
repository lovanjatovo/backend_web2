import { Request, Response } from "express";
import { ResultService } from "../service/ResultService";

export class ResultController {
    private service = new ResultService();

    submit = async (req: Request, res: Response) => {
        try {
            const studentId = req.user!.userId;
            const examId = Number(req.params.id);
            const { answers } = req.body;

            if (!Array.isArray(answers)) {
                return res.status(400).json({ message: "Answers must be an array" });
            }

            const result = await this.service.submitExam( studentId, examId, answers);
            return res.status(201).json(result);

        } catch (error) {
            if (!(error instanceof Error)) {
                return res.status(500).json({ message: "Internal server error" });
            }

            if (error.message === "EXAM_NOT_FOUND") {
                return res.status(404).json({ message: "Exam not found" });
            }

            if (error.message === "EXAM_NOT_AVAILABLE") {
                return res.status(403).json({ message: "Exam is not available" });
            }

            if (error.message === "ALREADY_ATTEMPTED") {
                return res.status(409).json({ message: "You have already attempted this exam" });
            }

            if (error instanceof Error && (error as any).code === "23505") {
                return res.status(409).json({ message: "You have already attempted this exam"});
            }

            if (error.message === "INVALID_CHOICE") {
                return res.status(400).json({ message: "Invalid choice selected" });
            }

            if (error.message === "INVALID_QUESTION") {
                return res.status(400).json({ message: "Question does not belong to this exam" });
            }

            if (error.message === "DUPLICATE_QUESTION") {
                return res.status(400).json({ message: "A question cannot be answered more than once" });
            }

            if (error.message === "INVALID_ANSWER") {
                return res.status(400).json({ message: "Invalid answer" });
            }

            return res.status(500).json({ message: "Internal server error" });
        }
    };

    getExamResults = async (req: Request, res: Response) => {
        try {
            const examId = Number(req.params.id);
            const results = await this.service.getExamResults(examId);
            return res.status(200).json(results);

        } catch (error) {
            if (error instanceof Error && error.message === "EXAM_NOT_FOUND" ) {
                return res.status(404).json({ message: "Exam not found" });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    };

    getMyResults = async (req: Request, res: Response) => {
        try {
            const results = await this.service.getResults(req.user!.userId);
            return res.status(200).json(results);
        } catch {
            return res.status(500).json({ message: "Internal server error" });
        }
    };
}