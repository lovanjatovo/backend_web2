import { QuestionRepository } from "../repository/QuestionRepository";
import { AttemptRepository } from "../repository/AttemptRepository";
import { ExamRepository } from "../repository/ExamRepository";

export class QuestionService {
    private repository = new QuestionRepository();
    private attemptRepository = new AttemptRepository();
    private examRepository = new ExamRepository();

    async getQuestionsForStudent(examId: number) {
        const exam = await this.examRepository.findById(examId);
        if (!exam) {throw new Error("EXAM_NOT_FOUND");}

        const now = new Date();
        if (now < new Date(exam.startDate) || now > new Date(exam.endDate)) {
            throw new Error("EXAM_NOT_AVAILABLE");
        }

        const questions = await this.repository.findByExam(examId);
        return questions.map(question => ({
            id: question.id,
            statement: question.statement,
            points: question.points,
            choices: question.choices.map((choice: any) => ({
                id: choice.id,
                content: choice.content
            }))
        }));
    }

    async getQuestionsForAdmin(examId: number) {
        return this.repository.findByExam(examId);
    }

    async createQuestion(
        examId: number,
        statement: string,
        points: number,
        choices: any[]
    ) {
        const hasAttempt = await this.attemptRepository.hasAttemptForExam(examId);

        if (hasAttempt) { throw new Error("EXAM_LOCKED");}

        if (choices.length < 2 || choices.length > 6) {
            throw new Error("INVALID_CHOICES_COUNT");
        }

        const correctChoices = choices.filter(choice => choice.isCorrect);
        if (correctChoices.length !== 1) {
            throw new Error("INVALID_CORRECT_CHOICE");
        }

        return this.repository.create(
            examId,
            statement,
            points,
            choices
        );
    }

    async updateQuestion(
        id: number,
        statement: string,
        points: number,
        choices: { content: string; isCorrect: boolean }[]
    ) {
        const question =
            await this.repository.findById(id);

        if (!question) {
            return null;
        }

        const hasAttempt = await this.attemptRepository.hasAttemptForExam( question.examId );
        if (hasAttempt) { throw new Error("EXAM_LOCKED");}
        if (choices.length < 2 || choices.length > 6) {
            throw new Error("INVALID_CHOICES_COUNT");
        }

        const correctChoices = choices.filter(choice => choice.isCorrect);
        if (correctChoices.length !== 1) {
            throw new Error("INVALID_CORRECT_CHOICE");
        }

        return this.repository.update(id, statement, points, choices );
    }

    async deleteQuestion(id: number) {
        const question = await this.repository.findById(id);
        if (!question) { return 0;}

        const hasAttempt = await this.attemptRepository.hasAttemptForExam( question.examId );
        if (hasAttempt) { throw new Error("EXAM_LOCKED");}

        return this.repository.delete(id);
    }
}