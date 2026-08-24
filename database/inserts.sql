INSERT INTO users (email, password_hash, role)
    VALUES
        ('admin@exam.com', '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX','ADMIN'),
        ('lova@student.com', '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'STUDENT'),
        ('allan@student.com', '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'STUDENT') ;

INSERT INTO courses (name, description)
    VALUES
        ( 'WEB2', 'Développement web avancé'),
        ('PROG2', 'Programmation avancée'),
        ( 'THEORIE P2', 'Théorie et concepts informatiques');

INSERT INTO exams ( course_id, name, start_date, end_date) VALUES
        (1, 'Examen WEB2', '2026-09-01 08:00:00', '2026-09-01 10:00:00'),
        (2,'Examen PROG2', '2026-09-05 08:00:00', '2026-09-05 10:00:00' );

INSERT INTO questions (exam_id, statement,points ) VALUES
        ( 1, 'Que signifie HTML ?', 1),
        ( 1, 'Quel langage est utilisé pour styliser une page web ?', 1);

INSERT INTO choices (question_id, content, is_correct
    ) VALUES
        (1, 'HyperText Markup Language', TRUE),
        (1, 'HighText Machine Language', FALSE),
        (1, 'HyperTool Markup Language', FALSE),

        (2, 'HTML', FALSE),
        (2, 'CSS', TRUE),
        (2, 'SQL', FALSE);

INSERT INTO attempts (student_id, exam_id, score
    ) VALUES
    ( 2, 1, 2);

INSERT INTO answers (attempt_id, question_id, choice_id
    ) VALUES
        (1, 1, 1),
        (1, 2, 5);