import { pool } from "../configuration/db";

export class AttemptRepository {
    async findByStudentAndExam(studentId: number, examId: number) {
        const result = await pool.query(
            `SELECT id, student_id AS "studentId", exam_id AS "examId",
                   score, submitted_at AS "submittedAt"
            FROM attempts
            WHERE student_id = $1 AND exam_id = $2 `, [studentId, examId]);

        return result.rows[0] ?? null;
    }

    async create(studentId: number, examId: number, score: number) {
        const result = await pool.query(
            `INSERT INTO attempts (student_id, exam_id, score)
            VALUES ($1, $2, $3)
            RETURNING id, student_id AS "studentId",
                      exam_id AS "examId", score,
                      submitted_at AS "submittedAt" `, [studentId, examId, score]);

        return result.rows[0];
    }

    async createAnswer(attemptId: number, questionId: number, choiceId: number | null) {
        await pool.query(
            `INSERT INTO answers (attempt_id, question_id, choice_id)
            VALUES ($1, $2, $3) `, [attemptId, questionId, choiceId]);
    }

    async hasAttemptForExam(examId: number) {
        const result = await pool.query(
            `SELECT 1
            FROM attempts
            WHERE exam_id = $1
            LIMIT 1 `, [examId]);

        return result.rowCount !== null && result.rowCount > 0;
    }

    async getExamResults(examId: number) {
        const result = await pool.query(
            `SELECT
                a.id,
                a.student_id AS "studentId",
                CONCAT_WS(' ', u.first_name, u.last_name) AS "studentName",
                u.email AS "email",
                a.exam_id AS "examId",
                e.name AS "examName",
                a.score,
                a.submitted_at AS "submittedAt"
            FROM attempts a
            JOIN users u ON u.id = a.student_id
            JOIN exams e ON e.id = a.exam_id
            WHERE a.exam_id = $1
            ORDER BY a.score DESC `, [examId]);

        return result.rows;
    }

    async getResults(studentId: number) {
        const result = await pool.query(`
            SELECT a.id, a.exam_id AS "examId",
                   e.name AS "examName",
                   a.score,
                   a.submitted_at AS "submittedAt"
            FROM attempts a
            JOIN exams e ON e.id = a.exam_id
            WHERE a.student_id = $1
            ORDER BY a.submitted_at DESC `, [studentId]);

        return result.rows;
    }

    async getAverage(studentId: number) {
        const result = await pool.query(
            `SELECT COALESCE(AVG(score), 0) AS average
            FROM attempts
            WHERE student_id = $1 `, [studentId]);

        return Number(result.rows[0].average);
    }
}