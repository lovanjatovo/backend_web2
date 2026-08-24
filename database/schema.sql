CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STUDENT')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,

    CONSTRAINT fk_exam_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id),

    CONSTRAINT valid_exam_dates
        CHECK (end_date > start_date)
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER NOT NULL,
    statement TEXT NOT NULL,
    points NUMERIC(5,2) NOT NULL DEFAULT 1,

    CONSTRAINT fk_question_exam
        FOREIGN KEY (exam_id)
        REFERENCES exams(id)
        ON DELETE CASCADE,

    CONSTRAINT valid_question_points
        CHECK (points > 0)
);

CREATE TABLE choices (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_choice_question
        FOREIGN KEY (question_id)
        REFERENCES questions(id)
        ON DELETE CASCADE
);

CREATE TABLE attempts (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    exam_id INTEGER NOT NULL,
    score NUMERIC(6,2) NOT NULL DEFAULT 0,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_attempt_student
        FOREIGN KEY (student_id)
        REFERENCES users(id),

    CONSTRAINT fk_attempt_exam
        FOREIGN KEY (exam_id)
        REFERENCES exams(id),

    CONSTRAINT unique_student_exam
        UNIQUE (student_id, exam_id)
);


CREATE TABLE answers (
    id SERIAL PRIMARY KEY,
    attempt_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    choice_id INTEGER,

    CONSTRAINT fk_answer_attempt
        FOREIGN KEY (attempt_id)
        REFERENCES attempts(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_answer_question
        FOREIGN KEY (question_id)
        REFERENCES questions(id),

    CONSTRAINT fk_answer_choice
        FOREIGN KEY (choice_id)
        REFERENCES choices(id),

    CONSTRAINT unique_attempt_question
        UNIQUE (attempt_id, question_id)
);