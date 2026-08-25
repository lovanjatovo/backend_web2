import { CourseRepository } from "../repository/CourseRepository";

export class CourseService {

    private repository =
        new CourseRepository();

    getAll() { return this.repository.findAll(); }

    create( name: string,  description: string) {
        return this.repository.create(name, description );
    }

    update(id: number, name: string, description: string) {
        return this.repository.update(id, name, description );
    }

    delete(id: number) {
        return this.repository.delete(id);
    }
}