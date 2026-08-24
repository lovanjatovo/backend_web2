import { pool } from "../configuration/db";

export class QuestionRepository {
    async findByExam(examId: number) {
        const result = await pool.query(
            `SELECT q.id AS "questionId", q.statement, q.points,
                   c.id AS "choiceId", c.content, c.is_correct AS "isCorrect"
            FROM questions q
            JOIN choices c ON c.question_id = q.id
            WHERE q.exam_id = $1
            ORDER BY q.id, c.id`
        , [examId]);

        const questions: any[] = [];

        for (const row of result.rows) {
            let question = questions.find(q => q.id === row.questionId);

            if (!question) {
                question = {
                    id: row.questionId,
                    statement: row.statement,
                    points: row.points,
                    choices: []
                };
                questions.push(question);
            }

            question.choices.push({
                id: row.choiceId,
                content: row.content,
                isCorrect: row.isCorrect
            });
        }

        return questions;
    }

    async findById(id: number) {
        const result = await pool.query(
            `SELECT
                id,
                exam_id AS "examId",
                statement,
                points
            FROM questions
            WHERE id = $1`, [id]);

        return result.rows[0] ?? null;
    }

    async create(examId: number, statement: string, points: number, choices: { content: string; isCorrect: boolean }[]) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const questionResult = await client.query(
                `INSERT INTO questions (exam_id, statement, points)
                VALUES ($1, $2, $3)
                RETURNING id, exam_id AS "examId", statement, points`
            , [examId, statement, points]);

            const question = questionResult.rows[0];

            const createdChoices = [];

            for (const choice of choices) {
                const result = await client.query(
                    `INSERT INTO choices (question_id, content, is_correct)
                    VALUES ($1, $2, $3)
                    RETURNING id, content`
                , [question.id, choice.content, choice.isCorrect]);

                createdChoices.push(result.rows[0]);
            }

            await client.query("COMMIT");

            return { ...question, choices: createdChoices };
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async update(
        id: number,
        statement: string,
        points: number,
        choices: { id?: number; content: string; isCorrect: boolean }[]
    ) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const questionResult = await client.query(
                `UPDATE questions
                SET statement = $1, points = $2
                WHERE id = $3
                RETURNING id, exam_id AS "examId", statement, points`
            , [statement, points, id]);

            if (questionResult.rowCount === 0) {
                await client.query("ROLLBACK");
                return null;
            }

            await client.query(
                `DELETE FROM choices WHERE question_id = $1`,
                [id]
            );

            const createdChoices = [];

            for (const choice of choices) {
                const result = await client.query(
                    `INSERT INTO choices (question_id, content, is_correct)
                    VALUES ($1, $2, $3)
                    RETURNING id, content`
                , [id, choice.content, choice.isCorrect]);

                createdChoices.push(result.rows[0]);
            }

            await client.query("COMMIT");

            return {...questionResult.rows[0], choices: createdChoices};
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async delete(id: number) {
        const result = await pool.query(`DELETE FROM questions WHERE id = $1`, [id]);
        return result.rowCount;
    }
}