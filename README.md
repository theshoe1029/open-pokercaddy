# Poker Caddy

Poker Caddy is a simple poker bankroll manager. It has a Spring Boot backend, a React frontend, and MySQL data storage. The system can be run following the instructions below in order. The Spring Boot application will run with errors if you attempt to start it without following these steps.

## Set Up MySQL Server
1. Follow the instructions [here](https://dev.mysql.com/doc/mysql-getting-started/en/) to install MySQL Server on your platform of choice 
2. Set up a password for MySQL using the instructions from step 1
3. Run ```CREATE DATABASE db_pokercaddy;``` in MySQL

## Running Spring Boot Application
1. Uncomment ```#spring.datasource.password=ENTER YOUR PASSWORD``` in application.properties and enter the password you set for MySQL
2. Use ```./mvnw spring-boot:run``` to start the Spring Boot application
3. (optional) To deploy to ec2 add ```server.port=80``` to application.properties and use ```sudo ./mvnw spring-boot:run``` to run the application

## Running React Application
1. The first time you run the react application, use ```npm install`` to install the necessary dependencies
2. Use ```npm run-script watch``` to start the react application, the react frontend will automatically update on changes