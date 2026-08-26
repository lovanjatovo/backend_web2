import { ExamRepository } from "../repository/ExamRepository";
import { AttemptRepository } from "../repository/AttemptRepository";

export class ExamService {
    private repository = new ExamRepository();
    private attemptRepository = new AttemptRepository();

    getAll() {return this.repository.findAll();}

    getById(id: number) {return this.repository.findById(id);}

    getAvailable(studentId: number) {return this.repository.findAvailableForStudent(studentId);}

    async create(courseId: number, name: string, startDate: string, endDate: string) {
        if (new Date(endDate) <= new Date(startDate)) {
            throw new Error("INVALID_DATES");
        }
        return this.repository.create(courseId, name, startDate, endDate);
    }

    async update(id: number, courseId: number, name: string, startDate: string, endDate: string) {
        if (new Date(endDate) <= new Date(startDate)) {
            throw new Error("INVALID_DATES");
        }

        const hasAttempt = await this.attemptRepository.hasAttemptForExam(id);
        if (hasAttempt) {
            throw new Error("EXAM_LOCKED");
        }

        return this.repository.update(id, courseId, name, startDate, endDate);
    }

    async delete(id: number) {
        const hasAttempt = await this.attemptRepository.hasAttemptForExam(id);
        if (hasAttempt) {
            throw new Error("EXAM_LOCKED");
        }

        return this.repository.delete(id);
    }
}