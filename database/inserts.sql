INSERT INTO users (first_name, last_name, email, password_hash, role)
VALUES
    ('Lova', 'Rakoto', 'lova@student.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT'),
    ('Allan', 'Andria', 'allan@student.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'STUDENT');

INSERT INTO courses (code, name, description)
VALUES
    ('DONNEES1', 'Base de données structurés', 'Entités et associations. Diagramme entité-association.'),
    ('PROG2', 'API et Programmation Orienté-Objet', 'Programmation orientée objet et conception API.'),
    ('WEB2', 'Applications globalement connectées', 'Applications web connectées et communication avec des services.');

INSERT INTO exams (course_id, name, start_date, end_date)
VALUES
    (1, 'Examen DONNEES1', '2026-09-01 08:00:00', '2026-09-01 10:00:00'),
    (2, 'Examen PROG2', '2026-09-05 08:00:00', '2026-09-05 10:00:00');

INSERT INTO questions (exam_id, statement, points)
VALUES
    (1, 'Que représente une entité dans un modèle entité-association ?', 1),
    (1, 'Quel langage est utilisé pour interroger une base de données relationnelle ?', 1);

INSERT INTO choices (question_id, content, is_correct)
VALUES
    (1, 'Un objet ou concept identifiable du domaine', TRUE),
    (1, 'Une commande SQL', FALSE),
    (1, 'Un serveur web', FALSE),
    (2, 'HTML', FALSE),
    (2, 'SQL', TRUE),
    (2, 'CSS', FALSE);

INSERT INTO attempts (student_id, exam_id, score)
VALUES
    (2, 1, 2);

INSERT INTO answers (attempt_id, question_id, choice_id)
VALUES
    (1, 1, 1),
    (1, 2, 5);
