const inquirer = require("inquirer");
const mysql = require("mysql2");


const connection = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "164046-m",
    database: "employees",
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database!");
    inquireAction();
});

deleteAction = (action) => {
    switch (action) {
        case "Delete a department":
            deleteDepartment();
            break;
        case "Delete a role":
            deleteRole();
            break;
        case "Delete an employee":
            deleteEmployee();
            break;
        case "Exit":
            connection.end();
            console.log("Goodbye!");
            break;
    }};

function inquireAction() {
    inquirer
        .prompt({
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Add a Manager",
                "Update an employee role",
                "View Employees by Manager",
                "View Employees by Department",
                "Delete Departments | Roles | Employees",
                "View the total utilized budget of a department",
                "Exit",
            ],
        })
        .then((answer) => {
            executeAction(answer.action);
        });

}

function executeAction(action) {
    switch (action) {
        case "View all departments":
            viewAllDepartments();
            break;
        case "View all roles":
            viewAllRoles();
            break;
        case "View all employees":
            viewAllEmployees();
            break;
        case "Add a department":
            addDepartment();
            break;
        case "Add a role":
            addRole();
            break;
        case "Add an employee":
            addEmployee();
            break;
        case "Add a Manager":
            addManager();
            break;
        case "Update an employee role":
            updateEmployeeRole();
            break;
        case "View Employees by Manager":
            viewEmployeesByManager();
            break;
        case "View Employees by Department":
            viewEmployeesByDepartment();
            break;
        case "Delete Departments | Roles | Employees":
            deleteDepartmentsRolesEmployees();
            break;
        case "View the total utilized budget of a department":
            viewBudgetOfDepartment();
            break;
        case "Exit":
            connection.end();
            console.log("Goodbye!");
            break;
    }
}

function viewAllDepartments() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        inquireAction();
    });
}

function viewAllRoles() {
    const query = "SELECT role.title, role.id, department.name, role.salary from role join department on role.department_id = department.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        inquireAction();
    });
};
function viewAllEmployees() {
    const query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, manager_id from employee join role on employee.role_id = role.id join department on role.department_id = department.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        inquireAction();
    });
};

function addDepartment() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt({
                type: "input",
                name: "name",
                message: "What is the name of the department?",
            })
            .then((answer) => {
                connection.query(
                    "INSERT INTO department SET ?",
                    {
                        name: answer.name,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log("Department added successfully!");
                        inquireAction();
                    }
                );
            });
    });
};

function addRole() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.name,
            value: department.id,
        }));
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "title",
                    message: "What is the title of the role?",
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the role?",
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "What is the department of the role?",
                    choices: departmentChoices,
                },
            ])
            .then((answer) => {
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.department_id,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log("Role added successfully!");
                        inquireAction();
                    }
                );
            });
    });
};

function addEmployee() {
    const query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const roleChoices = res.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "What is the first name of the employee?",
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the last name of the employee?",
                },
                {
                    type: "list",
                    name: "role_id",
                    message: "What is the role of the employee?",
                    choices: roleChoices,
                },
                {
                    type: "input",
                    name: "manager_id",
                    message: "What is the manager id of the employee?",
                },
            ])
            .then((answer) => {
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: answer.first_name,
                        last_name: answer.last_name,
                        role_id: answer.role_id,
                        manager_id: answer.manager_id,
                    },
                    (err) => {
                        if (err) throw err;
                        console.log("Employee added successfully!");
                        inquireAction();
                    }
                );
            });
    });
};

function addManager() {
    const query = "SELECT * FROM employee INNER join role on employee.role_id = role.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const managerChoices = res.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
            role_id: employee.role_id,
            value: employee.id,
        }));
        inquirer
            .prompt([{
                type: "input",
                name: "first_name",
                message: "What is the first name of the manager?",
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the last name of the manager?",
            },
            {
                type: "list",
                name: "manager_id",
                message: "Who is the employee?",
                choices: managerChoices,
            },
            ])
            .then((answer) => {
                console.log(answer)
                const query2 = `select role_id from employee where first_name = "${answer.first_name}" and last_name = "${answer.last_name}"`;
                connection.query(query2, (err, res) => {
                    if (err) throw err;
                    connection.query(
                        "INSERT INTO employee SET ?",
                        {
                            first_name: answer.first_name,
                            last_name: answer.last_name,
                            role_id: res[0].role_id,
                            manager_id: answer.manager_id,
                        },
                        (err) => {
                            if (err) throw err;
                            console.log("Manager added successfully!");
                            inquireAction();
                        }
                    );
                });
            });
    })
};

function updateEmployeeRole() {
    const query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const employeeChoices = res.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
        }));
    inquirer
    .prompt([
        {
            type: "list",
            name: "employee_id",
            message: "Which employee's role would you like to update?",
            choices: employeeChoices,
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the new role id?",
        },
    ])
    .then ((answer) => {
        connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
                {
                    role_id: answer.role_id,
                },
                {
                    id: answer.employee_id,
                },
            ],
            (err) => {
                if (err) throw err;
                console.log("Employee role updated successfully!");
                inquireAction();
            }
        );
    });
})};

function viewEmployeesByManager() {
    const query = "SELECT * FROM employee";
    connection.query (query, (err , res) => {
        if (err) throw err;
        const managerChoices = res.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
        }));
        inquirer
        .prompt({
            type: "list",
            name: "manager_id",
            message: "Which manager's employees would you like to view?",
            choices: managerChoices,
        })
        .then((answer) => {
            const query2 = `SELECT * FROM employee WHERE manager_id = ${answer.manager_id}`;
            connection.query(query2, (err, res) => {
                if (err) throw err;
                console.table(res);
                inquireAction();
            });
        });
    });
};

function viewEmployeesByDepartment() {
    const query = "SELECT * FROM department";
    connection.query (query, (err , res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.name,
            value: department.id,
        }));
        inquirer
        .prompt({
            type: "list",
            name: "department_id",
            message: "Which department's employees would you like to view?",
            choices: departmentChoices,
        })
        .then((answer) => {
            const query2 = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, manager_id from employee join role on employee.role_id = role.id join department on role.department_id = department.id WHERE department_id = ${answer.department_id}`;
            connection.query(query2, (err, res) => {
                if (err) throw err;
                console.table(res);
                inquireAction();
            });
        });
    });
};

function deleteDepartmentsRolesEmployees() {
    inquirer
    .prompt({
        type: "list",
        name: "action",
        message: "What would you like to delete?",
        choices: [
            "Delete a department",
            "Delete a role",
            "Delete an employee",
            "Exit",
        ],
    })
    .then((answer) => {
        deleteAction(answer.action);
    });
};

function deleteDepartment() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.name,
            value: department.id,
        }));
        inquirer
        .prompt({
            type: "list",
            name: "id",
            message: "Which department would you like to delete?",
            choices: departmentChoices,
        })
        .then((answer) => {
            connection.query(
                "DELETE FROM department WHERE ?",
                {
                    id: answer.id,
                },
                (err) => {
                    if (err) throw err;
                    console.log("Department deleted successfully!");
                    inquireAction();
                }
            );
        });
    });
};

function deleteRole() {
    const query = "SELECT * FROM role";
    connection.query (query, (err , res) => {
        if (err) throw err;
        const roleChoices = res.map((role) => ({
            name: role.title,
            value: role.id,
        }));
        inquirer
        .prompt({
            type: "list",
            name: "id",
            message: "Which role would you like to delete?",
            choices: roleChoices,
        })
        .then((answer) => {
            connection.query(
                "DELETE FROM role WHERE ?",
                {
                    id: answer.id,
                },
                (err) => {
                    if (err) throw err;
                    console.log("Role deleted successfully!");
                    inquireAction();
                }
            );
        });
    });
};

function deleteEmployee() {
    const query = "SELECT * FROM employee";
    connection.query (query, (err , res) => {
        if (err) throw err;
        const employeeChoices = res.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
        }));
        inquirer
        .prompt({
            type: "list",
            name: "id",
            message: "Which employee would you like to delete?",
            choices: employeeChoices,
        })
        .then((answer) => {
            connection.query(
                "DELETE FROM employee WHERE ?",
                {
                    id: answer.id,
                },
                (err) => {
                    if (err) throw err;
                    console.log("Employee deleted successfully!");
                    inquireAction();
                }
            );
        });
    });
};

function viewBudgetOfDepartment() {
    const query = "SELECT * FROM department";
    connection.query (query, (err , res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.name,
            value: department.id,
        }));
        inquirer
        .prompt({
            type: "list",
            name: "department_id",
            message: "Which department's budget would you like to view?",
            choices: departmentChoices,
        })
        .then((answer) => {
            const query2 = `SELECT SUM(role.salary) as budget from role WHERE department_id = ${answer.department_id}`;
            connection.query(query2, (err, res) => {
                if (err) throw err;
                console.table(res);
                inquireAction();
            });
        });
    });
};
