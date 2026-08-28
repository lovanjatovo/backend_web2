import { pool } from "../configuration/db";

export class CourseRepository {
    async findById(id: number) {
        const result = await pool.query(
            `SELECT id, code, name, description
             FROM courses
             WHERE id = $1`,
            [id]
        );
        return result.rows[0] ?? null;
    }

    async findAll() {
        const result = await pool.query(
            `SELECT id, code, name, description
            FROM courses
            ORDER BY id`
        );
        return result.rows;
    }

    async create(code: string, name: string, description: string | null ) {
        const result = await pool.query(
            `INSERT INTO courses (code, name, description)
            VALUES ($1, $2, $3)
            RETURNING id, code, name, description`,
            [code, name, description]
        );
        return result.rows[0];
    }

    async update(
        id: number,
        code: string,
        name: string,
        description: string | null
    ) {
        const result = await pool.query(
            `UPDATE courses
            SET code = $1,
                name = $2,
                description = $3
            WHERE id = $4
            RETURNING id, code, name, description`,
            [code, name, description, id]
        );
        return result.rows[0] ?? null;
    }

    async delete(id: number) {
        const result = await pool.query(
            `DELETE FROM courses
            WHERE id = $1`,
            [id]
        );
        return result.rowCount;
    }
}
