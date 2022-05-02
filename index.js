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
                'View Total Utilized Budget of a Department'
            ]
        }
    ]).then(data => {
        let { menuChoice } = data;
        switch(menuChoice) {
            case 'View All Departments':
                viewDepartment();
                break;
            case 'View All Roles':
                break;
            case 'View All Employees':
                break;
            case 'Add a Department':
                break;
            case 'Add a Role':
                break;
            case 'Add an Employee':
                break;
            case 'Update an Employee Role':
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
        .then(() => {
            mainMenu();
        })
}

mainMenu();