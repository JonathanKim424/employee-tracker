const cTable = require('console.table');
const inquirer = require('inquirer');
const db = require('./config/connection');

function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to do?',
            choices: [
                'View ...',
                'Add ...',
                'Update ...',
                'Delete ...',
                'Close Application'
            ]
        }
    ]).then(data => {
        const { menuChoice } = data;
        switch(menuChoice) {
            case 'View ...':
                viewMenu();
                break;
            case 'Add ...':
                addMenu();
                break;
            case 'Update ...':
                updateMenu();
                break;
            case 'Delete ...':
                deleteMenu();
                break;
            case 'Close Application':
                console.log('Thank you, have a nice day!');
                console.log('Closing connection to the database.');
                db.then(conn => conn.end());
                break;
            default:
                console.log('Something broke!');
                break;
        }
    });
}

function viewMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to view?',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'View Employees by Manager',
                'View Employees by Department',
                'View Total Utilized Budget of a Department',
                'Return to Main Menu'
            ]
        }
    ]).then(data => {
        let { menuChoice } = data;
        switch(menuChoice) {
            case 'View All Departments':
                viewDepartment();
                break;
            case 'View All Roles':
                viewRole();
                break;
            case 'View All Employees':
                viewEmployee();
                break;
            case 'View Employees by Manager':
                viewEmployeeByManager();
                break;
            case 'View Employees by Department':
                viewEmployeeByDepartment();
                break;
            case 'View Total Utilized Budget of a Department':
                viewTotalDepartmentBudget();
                break;
            case 'Return to Main Menu':
                mainMenu();
                break;
            default:
                console.log('Something broke!');
                break;
        }
    });
}

function addMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to add?',
            choices: [
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Return to Main Menu'
            ]
        }
    ]).then(data => {
        let { menuChoice } = data;
        switch(menuChoice) {
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Return to Main Menu':
                mainMenu();
                break;
            default:
                console.log('Something broke!');
                break;
        }
    });
}

function updateMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to update?',
            choices: [
                'Update an Employee Role',
                'Update an Employee Manager',
                'Return to Main Menu'
            ]
        }
    ]).then(data => {
        let { menuChoice } = data;
        switch(menuChoice) {
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
            case 'Update an Employee Manager':
                updateEmployeeManager();
                break;
            case 'Return to Main Menu':
                mainMenu();
                break;
            default:
                console.log('Something broke!');
                break;
        }
    }); 
}

function deleteMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'menuChoice',
            message: 'What would you like to delete?',
            choices: [
                'Delete a Department',
                'Delete a Role',
                'Delete an Employee',
                'Return to Main Menu'
            ]
        }
    ]).then(data => {
        let { menuChoice } = data;
        switch(menuChoice) {
            case 'Delete a Department':
                deleteDepartment();
                break;
            case 'Delete a Role':
                deleteRole();
                break;
            case 'Delete an Employee':
                deleteEmployee();
                break;
            case 'Return to Main Menu':
                mainMenu();
                break;
            default:
                console.log('Something broke!');
                break;
        }
    }); 
}

// database queries
//

function viewDepartment() {
    const sql =
        `SELECT
            id AS id,
            name AS Department
        FROM departments`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => console.table(rows))
        .then(closeApp);
}

function viewRole() {
    const sql =
        `SELECT 
            roles.id AS id,
            roles.title AS Role,
            roles.salary AS Salary,
            departments.name AS Department
        FROM roles
        LEFT JOIN departments ON roles.department_id = departments.id`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => console.table(rows))
        .then(closeApp);
}

function viewEmployee() {
    const sql =
        `SELECT
            A.id AS id,
            CONCAT(A.first_name, ' ', A.last_name) AS Name,
            roles.title AS Role,
            departments.name AS Department,
            roles.salary AS Salary,
            CONCAT(B.first_name, ' ', B.last_name) AS Manager
        FROM employees A
        LEFT JOIN roles ON A.role_id = roles.id
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees B ON B.id = A.manager_id`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => console.table(rows))
        .then(closeApp);
}

function viewEmployeeByManager() {
    let managerList = [];
    let managerIdList = [];
    const sql =
        `SELECT DISTINCT manager_id FROM employees`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => managerIdList = rows.map(({ manager_id }) => manager_id)).then(() => {
            if (managerIdList.indexOf(null) > -1) {
                managerIdList.splice(managerIdList.indexOf(null), 1);
            }
            let managerIds = ``;
            managerIdList.forEach(element => {
                if (managerIds.length < managerIdList.length) {
                    managerIds += element + ",";
                } else {
                    managerIds += element;
                }
            });
            const sql =
                `SELECT
                    CONCAT(first_name, ' ', last_name) AS name
                FROM employees
                WHERE id IN (${managerIds})`
            db.then(conn => conn.query(sql))
                .then(([rows, fields]) => managerList = rows.map(({ name }) => name)).then(() => {
                    managerList.push("None");
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager_id',
                            message: "Which manager would you like to view employees of?",
                            choices: managerList
                        }
                    ]).then(data => {
                        if (data.manager_id === 'None') {
                            const sql =
                                `SELECT
                                    employees.id AS id,
                                    CONCAT(employees.first_name, ' ', employees.last_name) AS Name,
                                    roles.title AS Role,
                                    departments.name AS Department,
                                    roles.salary AS Salary,
                                    employees.manager_id AS Manager
                                FROM employees
                                LEFT JOIN roles ON employees.role_id = roles.id
                                LEFT JOIN departments ON roles.department_id = departments.id
                                WHERE manager_id IS NULL`;
                            db.then(conn => conn.query(sql))
                                .then(([rows, fields]) => {
                                    if (rows.length === 0) {
                                        console.log('There are no employees without managers.');
                                        closeApp();
                                    } else {
                                        console.table(rows);
                                        closeApp();
                                    }
                                });
                        } else {
                            const sql =
                                `SELECT
                                    A.id AS id,
                                    CONCAT(A.first_name, ' ', A.last_name) AS Name,
                                    roles.title AS Role,
                                    departments.name AS Department,
                                    roles.salary AS Salary,
                                    CONCAT(B.first_name, ' ', B.last_name) AS Manager
                                FROM employees A
                                LEFT JOIN roles ON A.role_id = roles.id
                                LEFT JOIN departments ON roles.department_id = departments.id
                                LEFT JOIN employees B ON B.id = A.manager_id
                                WHERE A.manager_id = ?`;
                            const params = managerIdList[managerList.indexOf(data.manager_id)];
                            db.then(conn => conn.query(sql, params))
                                .then(([rows, fields]) => {
                                    console.table(rows);
                                    closeApp();
                                });
                        }
                    });
                });
        });
}

function viewEmployeeByDepartment() {
    let departmentList = [];
    const sql = `SELECT * FROM departments`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => departmentList = rows.map(({ name }) => name)).then(() => {
            departmentList.push('None');
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department_id',
                    message: "Which department would you like to view the employees of?",
                    choices: departmentList
                }
            ]).then(data => {
                if (data.department_id === 'None') {
                    const sql =
                        `SELECT
                            A.id AS id,
                            CONCAT(A.first_name, ' ', A.last_name) AS Name,
                            roles.title AS Role,
                            departments.name AS Department,
                            roles.salary AS Salary,
                            CONCAT(B.first_name, ' ', B.last_name) AS Manager
                        FROM employees A
                        LEFT JOIN roles ON A.role_id = roles.id
                        LEFT JOIN departments ON roles.department_id = departments.id
                        LEFT JOIN employees B ON B.id = A.manager_id
                        WHERE departments.name IS NULL`;
                    db.then(conn => conn.query(sql))
                        .then(([rows, fields]) => {
                            if (rows.length === 0) {
                                console.log('No employees found.');
                                closeApp();
                            } else {
                                console.table(rows);
                                closeApp();
                            }
                        });
                } else {
                    const sql =
                        `SELECT
                            A.id AS id,
                            CONCAT(A.first_name, ' ', A.last_name) AS Name,
                            roles.title AS Role,
                            departments.name AS Department,
                            roles.salary AS Salary,
                            CONCAT(B.first_name, ' ', B.last_name) AS Manager
                        FROM employees A
                        LEFT JOIN roles ON A.role_id = roles.id
                        LEFT JOIN departments ON roles.department_id = departments.id
                        LEFT JOIN employees B ON B.id = A.manager_id
                        WHERE departments.name = ?`;
                    const params = data.department_id;
                    db.then(conn => conn.query(sql, params))
                        .then(([rows, fields]) => {
                            if (rows.length === 0) {
                                console.log('There are no employees under this department.');
                                closeApp();
                            } else {
                                console.table(rows);
                                closeApp();
                            }
                        });
                }
            });
        });
}

function viewTotalDepartmentBudget() {
    let departmentList = [];
    const sql = `SELECT * FROM departments`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => departmentList = rows.map(({ name }) => name)).then(() => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department_id',
                    message: "Which department would you like to view the total budget of?",
                    choices: departmentList
                }
            ]).then(data => {
                const sql =
                    `SELECT roles.salary FROM employees
                    CROSS JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN departments ON roles.department_id = departments.id
                    WHERE departments.name = ?`;
                const params = data.department_id;
                db.then(conn => conn.query(sql, params))
                    .then(([rows, fields]) => {
                        let budget = rows.map(({ salary }) => salary);
                        let totalBudget = 0;
                        budget.forEach(element => {
                            totalBudget += parseFloat(element);
                        });
                        console.log(`The total budget for ${data.department_id} is $${totalBudget}.`);
                        closeApp();
                    });
            });
        });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?'
        }
    ]).then(data => {
        const sql =
            `INSERT INTO departments (name)
            VALUES (?)`;
        const params = Object.values(data);
        db.then(conn => conn.query(sql, params))
            .then(() => {
                console.log(`Successfully added ${params}!`);
                closeApp();
            });
    });
}

function addRole() {
    let departmentList = [];
    let departmentIdList = [];
    const sql = `SELECT * FROM departments`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => {
            departmentList = rows.map(({ name }) => name);
            departmentIdList = rows.map(({ id }) => id);
        }).then(() => {
            inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of the role?'
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the salary for the role?'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Which department is the role under?',
                choices: departmentList
            }
        ]).then(data => {
            let { department_id } = data;
            data.department_id = departmentIdList[departmentList.indexOf(department_id)];
            const sql =
                `INSERT INTO roles (title, salary, department_id)
                VALUES (?, ?, ?)`;
            const params = Object.values(data);
            db.then(conn => conn.query(sql, params))
                .then(() => {
                    console.log(`Successfully added ${params[0]}!`);
                    closeApp();
                });
        });
    });
}

function addEmployee() {
    let roleList = [];
    let employeeList = [];
    const sql = `SELECT * FROM roles`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => roleList = rows.map(({ title }) => title)).then(() => {
            const sql = `SELECT first_name, last_name FROM employees`;
            db.then(conn => conn.query(sql))
                .then(([rows, fields]) => employeeList = rows.map(({ first_name, last_name }) => first_name + " " + last_name))
                .then(() => {
                    employeeList.push('None');
                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'first_name',
                            message: "What is the employee's first name?"
                        },
                        {
                            type: 'input',
                            name: 'last_name',
                            message: "What is the employee's last name?"
                        },
                        {
                            type: 'list',
                            name: 'role_id',
                            message: "What is the employee's role?",
                            choices: roleList
                        },
                        {
                            type: 'list',
                            name: 'manager_id',
                            message: "Who is the employee's manager?\nNone may be selected.",
                            choices: employeeList
                        }
                    ]).then(data => {
                        let { role_id, manager_id } = data;
                        const sql =
                            `SELECT id FROM roles
                            WHERE title = ?`;
                        const params = role_id;
                        db.then(conn => conn.query(sql, params))
                            .then(([rows, fields]) => data.role_id = rows[0].id)
                            .then(() => {
                                if (manager_id === 'None') {
                                    const sql =
                                        `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                        VALUES (?, ?, ?, NULL)`;
                                    const params = [data.first_name, data.last_name, data.role_id];
                                    db.then(conn => conn.query(sql, params))
                                        .then(() => {
                                            console.log(`Successfully added ${params[0]} ${params[1]}!`);
                                            closeApp();
                                        });
                                } else {
                                    const sql =
                                        `SELECT id FROM employees
                                        WHERE first_name = ? AND last_name = ?`;
                                    const params = manager_id.split(" ");
                                    db.then(conn => conn.query(sql, params))
                                        .then(([rows, fields]) => data.manager_id = rows[0].id)
                                        .then(() => {
                                            const sql =
                                                `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                                VALUES (?, ?, ?, ?)`;
                                            const params = Object.values(data);
                                            db.then(conn => conn.query(sql, params))
                                                .then(() => {
                                                    console.log(`Successfully added ${params[0]} ${params[1]}!`);
                                                    closeApp();
                                            });
                                    });
                                }
                        });
                    });
            });
    });
}

function updateEmployeeRole() {
    let roleList = [];
    let employeeList = [];
    const sql = `SELECT * FROM roles`;
    const sql2 = `SELECT first_name, last_name FROM employees`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => roleList = rows.map(({ title }) => title));
    db.then(conn => conn.query(sql2))
        .then(([rows, fields]) => employeeList = rows.map(({ first_name, last_name }) => first_name + " " + last_name))
        .then(() => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: "Which employee would you like to change the role?",
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: "What is the employee's new role?",
                    choices: roleList
                }
            ]).then(data => {
                let { employee_id, role_id } = data;
                const sql =
                    `SELECT id FROM employees
                    WHERE first_name = ? AND last_name = ?`;
                const params = employee_id.split(" ");
                db.then(conn => conn.query(sql, params))
                    .then(([rows, fields]) => data.employee_id = rows[0].id)
                    .then(() => {
                        const sql =
                            `SELECT id FROM roles
                            WHERE title = ?`;
                        const params = role_id;
                        db.then(conn => conn.query(sql, params))
                            .then(([rows, fields]) => data.role_id = rows[0].id)
                            .then(() => {
                                const sql =
                                    `UPDATE employees SET role_id = ?
                                    WHERE id = ?`;
                                const params = [data.role_id, data.employee_id];
                                db.then(conn => conn.query(sql, params))
                                    .then(() => {
                                        console.log(`Successfully updated ${employee_id}'s role to ${role_id}!`);
                                        closeApp();
                                    });
                            })
                    });
            });
        });
}

function updateEmployeeManager() {
    let employeeList = [];
    let employeeIdList = [];
    const sql = `SELECT id, first_name, last_name FROM employees`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => {
            employeeList = rows.map(({ first_name, last_name }) => first_name + " " + last_name);
            employeeIdList = rows.map(({ id }) => id);
        }).then(() => {
            const managerList = [...employeeList];
            managerList.push('None');
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: "Which employee would you like to change the manager?",
                    choices: employeeList
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: "Who is this employee's manager? (None can be selected)",
                    choices: managerList
                }
            ]).then(data => {
                if (data.manager_id === 'None') {
                    const sql =
                        `UPDATE employees SET manager_id = NULL
                        WHERE id = ?`;
                    const params = employeeIdList[employeeList.indexOf(data.employee_id)];
                    db.then(conn => conn.query(sql, params))
                        .then(() => {
                            console.log(`Successfully updated ${data.employee_id}'s manager to none!`);
                            closeApp();
                        });
                } else {
                    const sql =
                        `UPDATE employees SET manager_id = ?
                        WHERE id = ?`;
                    const params = [
                        employeeIdList[employeeList.indexOf(data.manager_id)],
                        employeeIdList[employeeList.indexOf(data.employee_id)]
                    ];
                    db.then(conn => conn.query(sql, params))
                        .then(() => {
                            console.log(`Successfully updated ${data.employee_id}'s manager to ${data.manager_id}!`);
                            closeApp();
                        });
                }
            });
        });
}

function deleteDepartment() {
    let departmentList = [];
    const sql = `SELECT * FROM departments`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => departmentList = rows.map(({ name }) => name)).then(() => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department_id',
                    message: "Which department would you like to delete?",
                    choices: departmentList
                }
            ]).then(data => {
                const sql =
                    `DELETE FROM departments
                    WHERE name = ?`;
                const params = [data.department_id];
                db.then(conn => conn.query(sql, params))
                    .then(() => {
                        console.log(`Successfully deleted ${data.department_id}!`);
                        closeApp();
                    });
            });
        });
}

function deleteRole() {
    let roleList = [];
    const sql = `SELECT * FROM roles`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => roleList = rows.map(({ title }) => title)).then(() => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role_id',
                    message: "Which role would you like to delete?",
                    choices: roleList
                }
            ]).then(data => {
                const sql =
                    `DELETE FROM roles
                    WHERE title = ?`;
                const params = [data.role_id];
                db.then(conn => conn.query(sql, params))
                    .then(() => {
                        console.log(`Successfully deleted ${data.role_id}!`);
                        closeApp();
                    });
            });
        });
}

function deleteEmployee() {
    let employeeList = [];
    const sql = `SELECT first_name, last_name FROM employees`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => employeeList = rows.map(({ first_name, last_name}) => first_name + " " + last_name))
        .then(() => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: "Which employee would you like to delete?",
                    choices: employeeList
                }
            ]).then(data => {
                let { employee_id } = data;
                const sql =
                    `DELETE FROM employees
                    WHERE first_name = ? AND last_name = ?`;
                const params = employee_id.split(" ");
                db.then(conn => conn.query(sql, params))
                    .then(() => {
                        console.log(`Successfully deleted ${employee_id}!`);
                        closeApp();
                    });
            });
        });
}

function closeApp() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'rerun',
            message: 'Would you like to return to the main menu?'
        }
    ]).then(data => {
        if (data.rerun) {
            mainMenu();
        } else {
            console.log('Thank you, have a nice day!');
            console.log('Closing connection to the database.');
            db.then(conn => conn.end());
        }
    });
}

mainMenu();