import { UserRepository } from "../repository/UserRepository";
import { hashPassword } from "../security/password";

export class StudentService {
    private userRepository = new UserRepository();

    async createStudent(
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) {
        const existing = await this.userRepository.findByEmail(email);
        if (existing) {
            throw new Error("EMAIL_EXISTS");
        }

        const passwordHash = await hashPassword(password);

        return this.userRepository.create(
            firstName,
            lastName,
            email,
            passwordHash,
            "STUDENT"
        );
    }

    async getStudents() {
        return this.userRepository.findStudents();
    }

    async updateStudent(
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        isActive?: boolean,
        password?: string
    ) {
        const student = await this.userRepository.findById(id);
        if (!student || student.role !== "STUDENT") {
            throw new Error("NOT_FOUND");
        }

        const passwordHash = password ? await hashPassword(password) : undefined;

        return this.userRepository.updateStudent(
            id,
            firstName,
            lastName,
            email,
            isActive,
            passwordHash
        );
    }

    async deactivateStudent(id: number) {
        const student = await this.userRepository.findById(id);
        if (!student || student.role !== "STUDENT") {
            throw new Error("NOT_FOUND");
        }

        const updatedStudent = await this.userRepository.setStudentStatus(id, false);

        if (!updatedStudent) {
            throw new Error("NOT_FOUND");
        }

        return updatedStudent;
    }
}
