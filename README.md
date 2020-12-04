This Readme describes the process of running the project.

The initial creating of tables, loading of the data is done using the python file CSV_to_MySQL.py
Run the code on command prompt in the folder where the project is located 


python CSV_to_MySQL.py


The web application project is run once the SQL Database is setup and the Sample data is loaded into the database.

Run the following commands to setup and start the Project.
Open the Command Prompt or VSCode in the folder where package.json is present

1. npm install
This installs the packages required for the Project

2. npm run dev
This step runs both the nodejs server on http://localhost:3001 and the reactjs frontend on http://localhost:3000

The landing page is the list of all contacts received through the REST API Call to the MySql Database.
The Landing Page also has a link to Add Contact. Each row in the table has options of Delete and Edit the Particular Contact.
