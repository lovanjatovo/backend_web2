import { ExamRepository } from "../repository/ExamRepository";
import { AttemptRepository } from "../repository/AttemptRepository";
import { CourseRepository } from "../repository/CourseRepository";

export class ExamService {
    private repository = new ExamRepository();
    private attemptRepository = new AttemptRepository();
    private courseRepository = new CourseRepository();

    getAll() {return this.repository.findAll();}

    getById(id: number) {return this.repository.findById(id);}

    getAvailable(studentId: number) {return this.repository.findAvailableForStudent(studentId);}

    async create(courseId: number, name: string, startDate: string, endDate: string) {
        if (new Date(endDate) <= new Date(startDate)) {
            throw new Error("INVALID_DATES");
        }

        const course = await this.courseRepository.findById(courseId);
        if (!course) {
            throw new Error("COURSE_NOT_FOUND");
        }

        return this.repository.create(courseId, name, startDate, endDate);
    }

    async update(id: number, courseId: number, name: string, startDate: string, endDate: string) {
        if (new Date(endDate) <= new Date(startDate)) {
            throw new Error("INVALID_DATES");
        }

        const course = await this.courseRepository.findById(courseId);
        if (!course) {
            throw new Error("COURSE_NOT_FOUND");
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