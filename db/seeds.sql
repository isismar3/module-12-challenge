use employees;

INSERT INTO department (name) VALUES
    ('Administrative'),
    ('HR'),
    ('IT'),
    ('Finance'),
    ('Production Department'),
    ('Marketing'),
    ('Sales'),
    ('Packaging Department'),
    ('Maintance');



INSERT INTO role (title, salary, department_id) VALUES 
    ('Administrator', 100000.00, 1),
    ('HR Director', 85000.00, 2),
    ('IT Manager', 150000.00, 3),
    ('Finance Head', 200000.00, 4),
    ('Production Manager', 75000.00, 5),
    ('Creative Director', 45000.00, 6),
    ('Customer Service Manager', 80000.00, 7),
    ('Shipping Manager ', 64000.00, 8),
    ('Maintenance Manager', 120000.00, 9);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('Jackson', 'Carter', 1, 1),
    ('Hudson', 'Hunter', 2, 2),
    ('Newton', 'Cameron', 3, 3),
    ('Carson', 'Thomas', 4, 4),
    ('Oliver', 'Lewis', 5, 5),
    ('Tucker', 'Floyd', 6, 6),
    ('Arthur', 'Matthew', 7, 7),
    ('Curtis', 'Walter', 8, 8),
    ('Edward', 'Mason', 9, 9);