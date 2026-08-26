import { CourseRepository } from "../repository/CourseRepository";

export class CourseService {
    private repository = new CourseRepository();

    getAll() {
        return this.repository.findAll();
    }

    create(code: string, name: string, description: string) {
        return this.repository.create(code, name, description);
    }

    update(id: number, code: string, name: string, description: string) {
        return this.repository.update(id, code, name, description);
    }

    delete(id: number) {
        return this.repository.delete(id);
    }
}