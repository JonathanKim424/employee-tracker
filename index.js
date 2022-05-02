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
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Update an Employee Manager',
                'View Employees by Manager',
                'View Employees by Department',
                'Delete a Department',
                'Delete a Role',
                'Delete an Employee',
                'View Total Utilized Budget of a Department',
                'Close Application'
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
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
            case 'Update an Employee Manager':
                break;
            case 'View Employees by Manager':
                break;
            case 'View Employees by Department':
                break;
            case 'Delete a Department':
                break;
            case 'Delete a Role':
                break;
            case 'Delete an Employee':
                break;
            case 'View Total Utilized Budget of a Department':
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
                    message: "Which is the employee's role?",
                    choices: roleList
                },
                {
                    type: 'number',
                    name: 'manager_id',
                    message: "What is the employee's manager's ID? (Optional)"
                }
        ]).then(data => {
            let { role_id } = data;
            data.role_id = roleList.indexOf(role_id) + 1;
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
                    message: "Which employee would you like to update?",
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
                data.employee_id = employeeList.indexOf(employee_id) + 1;
                data.role_id = roleList.indexOf(role_id) + 1;
                const sql =
                    `UPDATE employees SET role_id = ?
                    WHERE id = ?`;
                const params = [data.role_id, data.employee_id];
                db.then(conn => conn.query(sql, params))
                    .then(() => {
                        console.log(`Successfully updated ${employee_id}'s role to ${role_id}!`);
                        closeApp();
                    });
            });
        });
}

function updateEmployeeManager() {
    
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