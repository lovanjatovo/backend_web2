import { pool } from "../configuration/db";
import { User, Role } from "../model/User";

export class UserRepository {

    async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query(
            `SELECT
                id,
                email,
                password_hash AS "passwordHash",
                role,
                is_active AS "isActive"
            FROM users
            WHERE email = $1`,
            [email]
        );

        return result.rows[0] ?? null;
    }

    async create(
        email: string,
        passwordHash: string,
        role: Role
    ): Promise<User> {
        const result = await pool.query(
            `INSERT INTO users
                (email, password_hash, role)
            VALUES
                ($1, $2, $3)
            RETURNING
                id,
                email,
                password_hash AS "passwordHash",
                role,
                is_active AS "isActive" `,
            [email, passwordHash, role]
        );

        return result.rows[0];
    }

    async findStudents(): Promise<User[]> {
        const result = await pool.query(
            `SELECT
                id,
                email,
                password_hash AS "passwordHash",
                role,
                is_active AS "isActive"
            FROM users
            WHERE role = 'STUDENT'
            ORDER BY id `
        );

        return result.rows;
    }

    async findById(id: number): Promise<User | null> {

        const result = await pool.query(
            `SELECT
                id,
                email,
                password_hash AS "passwordHash",
                role,
                is_active AS "isActive"
            FROM users
            WHERE id = $1 `,
            [id]
        );

        return result.rows[0] ?? null;
    }

    async updateStudent(
        id: number,
        email: string
    ): Promise<User | null> {

        const result = await pool.query(
            `UPDATE users
            SET email = $1
            WHERE id = $2
              AND role = 'STUDENT'
            RETURNING
                id,
                email,
                password_hash AS "passwordHash",
                role,
                is_active AS "isActive" `,
            [email, id]
        );

        return result.rows[0] ?? null;
    }

    async deactivateStudent(id: number) {
        await pool.query(
            `UPDATE users
            SET is_active = false
            WHERE id = $1
              AND role = 'STUDENT' `,
            [id]
        );
    }
}