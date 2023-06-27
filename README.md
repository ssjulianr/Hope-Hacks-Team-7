# HopeHacks - Aireon
Welcome to C13 Team 7's HopeHacks Project! 

Aireon is a web application that aims to address air quality issues. By entering any US zip code, users can view the Air Quality Index (AQI) and the main pollutants present in that area. The purpose of the website is to raise awareness about local air quality and enable users to take necessary precautions based on the information provided.

# Dependencies
The following dependencies are used in the Aireon project:

body-parser (version "^1.20.2"): Node.js body parsing middleware.
ejs (version "^3.1.9"): Embedded JavaScript templates for generating dynamic HTML pages.
express (version "^4.18.2"): Web application framework for Node.js.
express-validator (version "^7.0.1"): Middleware for validating request data in Express.
mysql2 (version "^3.4.2"): MySQL client for Node.js.
node (version "^20.2.0"): Node.js runtime.
node-fetch (version "^2.6.11"): A light-weight module that brings Fetch API to Node.js.
nodemon (version "^2.0.22"): Development tool that automatically restarts the Node.js application when file changes are detected.

# Installation
To run the Aireon application, follow these steps:

1) Make sure you have Node.js installed on your machine.
   
2) Clone the HopeHacks repository from GitHub.
   
3) Run the following commands in the terminal
 
     npm init
     npm i node node-fetch ejs fetch bcrypt mysql2 body-parser express nodemon express-validator
   
4) Once the installation is complete, you can start the application by running the following command:
 
     npm run start
   
5) Open your web browser and visit http://localhost:777 to access the Aireon website.

6) In order to access the Admin Console without implementing a database, you can visit http://localhost:777/admin.

7) To create and manage users, you will need a database named HopeHacks with a table named Users. The table should hold an auto incrementing ID, Username, and Password. 
 
# Usage
On the Aireon website's AQI Lookup page, enter a US zip code in the provided input field.

Click on the "Submit" button.

The website will display the Air Quality Index (AQI) for the entered zip code, along with information about the main pollutants present in that area.

Users can take necessary precautions and make informed decisions based on the provided air quality information.

# Contributing
If you would like to contribute to the Aireon project, please clone this repository and email your version to ssjulianr@gmail.com- I would love to see what you've done!

# License
HopeHacks and Aireon are released under the MIT License. Please see the LICENSE file for more details.

# Contact
If you have any questions or suggestions regarding the Aireon project, feel free to reach out to us at ssjulianr@gmail.com. We appreciate your feedback!

Thank you for using Aireon and contributing to a healthier environment!
