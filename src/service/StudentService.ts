import { UserRepository } from "../repository/UserRepository";
import { hashPassword } from "../security/password";

export class StudentService {
    private userRepository = new UserRepository();

    async createStudent(email: string, password: string) {
        const existing = await this.userRepository.findByEmail(email);
        if (existing) { throw new Error("EMAIL_EXISTS"); }

        const passwordHash = await hashPassword(password);

        return this.userRepository.create(email, passwordHash, "STUDENT");
    }

    async getStudents() { return this.userRepository.findStudents(); }

    async updateStudent(id: number, email: string) {
        const student = await this.userRepository.findById(id);
        if (!student) { throw new Error("NOT_FOUND"); }

        return this.userRepository.updateStudent(id, email);
    }

    async deactivateStudent(id: number) {
        const student = await this.userRepository.findById(id);
        if (!student) { throw new Error("NOT_FOUND"); }

        await this.userRepository.deactivateStudent(id);
    }
}