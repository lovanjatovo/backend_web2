import { AttemptRepository } from "../repository/AttemptRepository";
import { ExamRepository } from "../repository/ExamRepository";
import { QuestionRepository } from "../repository/QuestionRepository";

export class ResultService {
    private attemptRepository = new AttemptRepository();
    private examRepository = new ExamRepository();
    private questionRepository = new QuestionRepository();

    async submitExam(studentId: number, examId: number, answers: any[]) {
        const exam = await this.examRepository.findById(examId);
        if (!exam) {throw new Error("EXAM_NOT_FOUND");}

        const now = new Date();
        if (now < new Date(exam.startDate) || now > new Date(exam.endDate)) {
            throw new Error("EXAM_NOT_AVAILABLE");
        }

        const existing = await this.attemptRepository.findByStudentAndExam(studentId, examId);
        if (existing) {
            throw new Error("ALREADY_ATTEMPTED");
        }

        const questions = await this.questionRepository.findByExam(examId);
        let score = 0;
        const correction = questions.map(question => {
            const answer = answers.find( a => a.questionId === question.id);

            const selectedChoice = question.choices.find(
                (choice: any) => choice.id === answer?.choiceId
                );
                
            if (answer && !selectedChoice) { throw new Error("INVALID_CHOICE");}

            const correctChoice = question.choices.find(
                    (choice: any) => choice.isCorrect
                );

            const isCorrect = selectedChoice?.isCorrect === true;

            const points = isCorrect ? Number(question.points): 0;
            score += points;

            return {
                questionId: question.id,
                statement: question.statement,
                selectedChoice: selectedChoice ? {id: selectedChoice.id,content: selectedChoice.content}: null,
                correctChoice: {
                    id: correctChoice.id,
                    content: correctChoice.content
                },
                isCorrect,
                points
            };
        });

        const attempt = await this.attemptRepository.create(studentId, examId, score);
        for (const question of questions) {
            const answer = answers.find(
                    a => a.questionId === question.id
                );

            await this.attemptRepository.createAnswer(
                attempt.id,
                question.id,
                answer?.choiceId ?? null
            );
        }

        return { attemptId: attempt.id, score, correction };
    }
    async getExamResults(examId: number) {
        const exam = await this.examRepository.findById(examId);
        if (!exam) { throw new Error("EXAM_NOT_FOUND");}

        return this.attemptRepository.getExamResults(examId);
    }

    async getResults(studentId: number) {
        const results = await this.attemptRepository.getResults(studentId);
        const average = await this.attemptRepository.getAverage(studentId);
        return { results, average };
    }

    
}