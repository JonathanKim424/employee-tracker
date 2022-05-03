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
        let { menuChoice } = data;
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

function viewDepartment() {
    const sql = `SELECT * FROM departments`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => console.table(rows))
        .then(closeApp);
}

function viewRole() {
    const sql = `SELECT * FROM roles`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => console.table(rows))
        .then(closeApp);
}

function viewEmployee() {
    const sql = `SELECT * FROM employees`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => console.table(rows))
        .then(closeApp);
}

function viewEmployeeByManager() {
    inquirer.prompt([
        {
            type: 'number',
            name: 'manager_id',
            message: "Which manager ID would you like to view employees of?\n(Can be left blank to view employees without managers)"
        }
    ]).then(data => {
        if (!data.manager_id) {
            const sql =
                `SELECT * FROM employees
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
                `SELECT * FROM employees
                WHERE manager_id = ?`;
            const params = [data.manager_id];
            db.then(conn => conn.query(sql, params))
                .then(([rows, fields]) => {
                    if (rows.length === 0) {
                        console.log('There are no employees under this manager ID.');
                        closeApp();
                    } else {
                        console.table(rows);
                        closeApp();
                    }
                });
        }
    });
}

function viewEmployeeByDepartment() {
    let departmentList = [];
    const sql = `SELECT * FROM departments`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => departmentList = rows.map(({ name }) => name)).then(() => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'department_id',
                    message: "Which department would you like to view the employees of?",
                    choices: departmentList
                }
            ]).then(data => {
                let { department_id } = data;
                data.department_id = departmentList.indexOf(department_id) + 1;
                const sql =
                    `SELECT employees.id, employees.first_name, employees.last_name, roles.title, employees.manager_id, departments.name
                    FROM employees
                    CROSS JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN departments ON roles.department_id = departments.id
                    WHERE departments.id = ?`;
                const params = [data.department_id];
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
                let { department_id } = data;
                data.department_id = departmentList.indexOf(department_id) + 1;
                const sql =
                    `SELECT roles.salary FROM employees
                    CROSS JOIN roles ON employees.role_id = roles.id
                    LEFT JOIN departments ON roles.department_id = departments.id
                    WHERE departments.id = ?`;
                const params = [data.department_id];
                db.then(conn => conn.query(sql, params))
                    .then(([rows, fields]) => {
                        let budget = rows.map(({ salary }) => salary);
                        let totalBudget = 0;
                        budget.forEach(element => {
                            totalBudget += parseFloat(element);
                        });
                        console.log(`The total budget for ${department_id} is $${totalBudget}.`);
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
    const sql = `SELECT * FROM departments`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => departmentList = rows.map(({ name }) => name)).then(() => {
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
            data.department_id = departmentList.indexOf(department_id) + 1;
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
    const sql = `SELECT * FROM roles`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => roleList = rows.map(({ title }) => title)).then(() => {
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
                    type: 'number',
                    name: 'manager_id',
                    message: "What is the employee's manager's ID? (Optional)"
                }
        ]).then(data => {
            let { role_id } = data;
            const sql =
                `SELECT id FROM roles
                WHERE title = ?`;
            const params = role_id;
            db.then(conn => conn.query(sql, params))
                .then(([rows, fields]) => data.role_id = rows[0].id)
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
                })
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
    const sql = `SELECT first_name, last_name FROM employees`;
    db.then(conn => conn.query(sql))
        .then(([rows, fields]) => employeeList = rows.map(({ first_name, last_name }) => first_name + " " + last_name))
        .then(() => {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: "Which employee would you like to change the manager?",
                    choices: employeeList
                },
                {
                    type: 'number',
                    name: 'manager_id',
                    message: "What is the employee's new manager's ID? (Can be left empty)"
                }
            ]).then(data => {
                let { employee_id, manager_id } = data;
                data.employee_id = employeeList.indexOf(employee_id) + 1;
                const sql =
                    `UPDATE employees SET manager_id = ?
                    WHERE id = ?`;
                const params = [data.manager_id, data.employee_id];
                db.then(conn => conn.query(sql, params))
                    .then(() => {
                        console.log(`Successfully updated ${employee_id}'s manager ID to ${manager_id}!`);
                        closeApp();
                    });
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
                let { department_id } = data;
                data.department_id = departmentList.indexOf(department_id) + 1;
                const sql =
                    `DELETE FROM departments
                    WHERE id = ?`;
                const params = [data.department_id];
                db.then(conn => conn.query(sql, params))
                    .then(() => {
                        console.log(`Successfully deleted ${department_id}!`);
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
                let { role_id } = data;
                data.role_id = roleList.indexOf(role_id) + 1;
                const sql =
                    `DELETE FROM roles
                    WHERE id = ?`;
                const params = [data.role_id];
                db.then(conn => conn.query(sql, params))
                    .then(() => {
                        console.log(`Successfully deleted ${role_id}!`);
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
                    `SELECT id FROM employees
                    WHERE first_name = ? AND last_name = ?`;
                const params = employee_id.split(" ");
                db.then(conn => conn.query(sql, params))
                    .then(([rows, fields]) => data.employee_id = rows[0].id)
                    .then(() => {
                        const sql =
                            `DELETE FROM employees
                            WHERE id = ?`;
                        const params = data.employee_id;
                        db.then(conn => conn.query(sql, params))
                            .then(() => {
                                console.log(`Successfully deleted ${employee_id}!`);
                                closeApp();
                            });
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