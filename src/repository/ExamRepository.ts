import { pool } from "../configuration/db";


export class ExamRepository {
    async findAll() {
        const result = await pool.query(
            `SELECT e.id, e.course_id AS "courseId", e.name,
                   e.start_date AS "startDate", e.end_date AS "endDate",
                   c.name AS "courseName",
                   EXISTS (SELECT 1 FROM attempts a WHERE a.exam_id = e.id) AS "hasAttempt"
            FROM exams e
            JOIN courses c ON c.id = e.course_id
            ORDER BY e.start_date
        `);
        return result.rows;
    }

    async findById(id: number) {
        const result = await pool.query(
            `SELECT e.id, e.course_id AS "courseId", e.name,
                   e.start_date AS "startDate", e.end_date AS "endDate",
                   c.name AS "courseName"
            FROM exams e
            JOIN courses c ON c.id = e.course_id
            WHERE e.id = $1
        `, [id]);
        return result.rows[0] ?? null;
    }

    async create(courseId: number, name: string, startDate: string, endDate: string) {
        const result = await pool.query(
            `INSERT INTO exams (course_id, name, start_date, end_date)
            VALUES ($1, $2, $3, $4)
            RETURNING id, course_id AS "courseId", name,
                      start_date AS "startDate", end_date AS "endDate"
        `, [courseId, name, startDate, endDate]);
        return result.rows[0];
    }

    async update(id: number, courseId: number, name: string, startDate: string, endDate: string) {
        const result = await pool.query(
            `UPDATE exams
            SET course_id = $1, name = $2, start_date = $3, end_date = $4
            WHERE id = $5
            RETURNING id, course_id AS "courseId", name,
                      start_date AS "startDate", end_date AS "endDate"
        `, [courseId, name, startDate, endDate, id]);
        return result.rows[0] ?? null;
    }

    async findAvailableForStudent(studentId: number) {
        const result = await pool.query(
            `SELECT e.id, e.name,
                e.course_id AS "courseId",
                c.name AS "courseName",
                e.start_date AS "startDate",
                e.end_date AS "endDate"
            FROM exams e
            JOIN courses c ON c.id = e.course_id
            WHERE e.start_date <= CURRENT_TIMESTAMP
              AND e.end_date >= CURRENT_TIMESTAMP
              AND NOT EXISTS (
                  SELECT 1
                  FROM attempts a
                  WHERE a.exam_id = e.id
                    AND a.student_id = $1
              )
            ORDER BY e.start_date
        `, [studentId]);
        return result.rows;
    }

    async delete(id: number) {
        const result = await pool.query(`DELETE FROM exams WHERE id = $1`, [id]);
        return result.rowCount;
    }
}