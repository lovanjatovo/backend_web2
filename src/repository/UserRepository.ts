import { pool } from "../configuration/db";
import { User, Role } from "../model/User";

export class UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query(
            `SELECT
                id,
                first_name AS "firstName",
                last_name AS "lastName",
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
        firstName: string,
        lastName: string,
        email: string,
        passwordHash: string,
        role: Role
    ): Promise<User> {
        const result = await pool.query(
            `INSERT INTO users
                (first_name, last_name, email, password_hash, role)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                password_hash AS "passwordHash",
                role,
                is_active AS "isActive"`,
            [firstName, lastName, email, passwordHash, role]
        );

        return result.rows[0];
    }

    async findStudents(): Promise<User[]> {
        const result = await pool.query(
            `SELECT
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                password_hash AS "passwordHash",
                role,
                is_active AS "isActive"
            FROM users
            WHERE role = 'STUDENT'
            ORDER BY id`
        );

        return result.rows;
    }

    async findById(id: number): Promise<User | null> {
        const result = await pool.query(
            `SELECT
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                password_hash AS "passwordHash",
                role,
                is_active AS "isActive"
            FROM users
            WHERE id = $1`,
            [id]
        );

        return result.rows[0] ?? null;
    }

    async updateStudent(
        id: number,
        firstName: string,
        lastName: string,
        email: string,
        isActive?: boolean
    ): Promise<User | null> {
        const result = await pool.query(
            `UPDATE users
            SET first_name = $1,
                last_name = $2,
                email = $3,
                is_active = COALESCE($4, is_active)
            WHERE id = $5
              AND role = 'STUDENT'
            RETURNING
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                password_hash AS "passwordHash",
                role,
                is_active AS "isActive"`,
            [firstName, lastName, email, isActive ?? null, id]
        );

        return result.rows[0] ?? null;
    }

    async setStudentStatus(id: number, isActive: boolean): Promise<User | null> {
        const result = await pool.query(
            `UPDATE users
            SET is_active = $1
            WHERE id = $2
              AND role = 'STUDENT'
            RETURNING
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email,
                password_hash AS "passwordHash",
                role,
                is_active AS "isActive"`,
            [isActive, id]
        );

        return result.rows[0] ?? null;
    }
}
