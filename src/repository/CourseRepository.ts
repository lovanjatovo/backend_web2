import { pool } from "../configuration/db";

export class CourseRepository {

    async findAll() {
        const result = await pool.query(
            `SELECT id, name, description
            FROM courses
            ORDER BY id `
        );

        return result.rows;
    }

    async create( name: string, description: string) {
        const result = await pool.query(
            `INSERT INTO courses (name, description)
            VALUES ($1, $2)
            RETURNING id, name, description `,
            [name, description]
        );

        return result.rows[0];
    }

    async update(
        id: number,
        name: string,
        description: string
    ) {

        const result = await pool.query(
            `UPDATE courses
            SET name = $1,
                description = $2
            WHERE id = $3
            RETURNING id, name, description `,
            [name, description, id]
        );

        return result.rows[0] ?? null;
    }

    async delete(id: number) {

        const result = await pool.query(
            ` DELETE FROM courses
            WHERE id = $1 `,
            [id]
        );

        return result.rowCount;
    }
}