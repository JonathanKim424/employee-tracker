INSERT INTO departments (name)
VALUES
    ('Department 1'),
    ('Department 2'),
    ('Department 3');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('Level 1', 300, 1),
    ('Level 2', 600, 1),
    ('Level 3', 900, 2),
    ('Level 4', 1200, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('James', 'Fraser', 4, NULL),
    ('Jack', 'London', 2, 1),
    ('Robert', 'Bruce', 3, 1),
    ('Peter', 'Greenaway', 1, 1),
    ('Sandy', 'Powell', 4, NULL),
    ('Emil', 'Zola', 1, 5),
    ('Tony', 'Duvert', 2, 5),
    ('Monica', 'Johnson', 3, 5);