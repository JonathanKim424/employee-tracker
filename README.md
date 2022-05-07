# Employee Tracker
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Description
A command line based content management system that allows a business owner to view and manage departments, roles, and employees.

## Built With
* MySQL2
* JavaScript
* Node.js
* Inquirer
* Console.Table
* dotenv

## Installation
MySQL must be installed. Run 'npm i' to install required packages then update the .env file with your username and password for MySQL. To initialize the database, enter the MySQL console while in the root folder and run the following:
    'source db/db.sql'
    'source db/schema.sql'
Additionally 'source db/seeds.sql' can be ran to populate the database with example data.

## Usage
For ease of use, the application can be started with 'npm start'. This can be modified as needed in the package.json file.

![Application Screenshot](./assets/images/application-screenshot.jpg?raw=tru "Application Screenshot")

Video of Application:
https://drive.google.com/file/d/1rrpL-eCNmRR9Y0Ov9-fLEBeHkCqiBG_5/view?usp=sharing

## Tests
There are no tests for this application.

## Credits
Made by Jonathan Kim

## License
Copyright &copy; 2022 Jonathan Kim

Licensed under the Apache License, Version 2.0 (the "License"). You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.