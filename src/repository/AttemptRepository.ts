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
        const examResult = await pool.query(
            `SELECT e.id, e.name AS title,
                    COALESCE((SELECT SUM(q.points) FROM questions q WHERE q.exam_id = e.id), 0) AS total_points,
                    (SELECT COUNT(*) FROM attempts a2 WHERE a2.exam_id = e.id) AS attempt_count,
                    (SELECT AVG(a3.score) FROM attempts a3 WHERE a3.exam_id = e.id) AS average
             FROM exams e
             WHERE e.id = $1`,
            [examId]
        );

        const summary = examResult.rows[0];

        const result = await pool.query(
            `SELECT
                a.student_id AS student_id,
                CONCAT_WS(' ', u.first_name, u.last_name) AS name,
                u.email AS email,
                a.score,
                a.submitted_at AS submitted_at
             FROM attempts a
             JOIN users u ON u.id = a.student_id
             WHERE a.exam_id = $1
             ORDER BY a.score DESC, name`,
            [examId]
        );

        return {
            exam: {
                id: summary.id,
                title: summary.title
            },
            total_points: Number(summary.total_points ?? 0),
            average: summary.average === null ? null : Number(Number(summary.average).toFixed(2)),
            attempt_count: Number(summary.attempt_count ?? 0),
            results: result.rows.map((row) => ({
                student_id: row.student_id,
                name: row.name,
                email: row.email,
                score: Number(row.score),
                submitted_at: row.submitted_at
            }))
        };
    }

    async getResults(studentId: number) {
        const result = await pool.query(`
            SELECT a.id, a.exam_id AS "examId",
                   e.name AS "examName",
                   a.score,
                   COALESCE((
                       SELECT SUM(q.points)
                       FROM questions q
                       WHERE q.exam_id = e.id
                   ), 0) AS "maxScore",
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