import csv
import mysql.connector
from mysql.connector import Error

def CreateTables():
    cursor.execute("CREATE TABLE `Contact_Names` (`Contact_ID`  integer NOT NULL AUTO_INCREMENT ,`First_Name`  varchar(45) ,`Middle_Name` varchar(45) ,`Last_Name` varchar(45) , PRIMARY KEY (`Contact_ID`));")
    cursor.execute("CREATE TABLE `Contact_Phone`(`Phone_ID` integer NOT NULL AUTO_INCREMENT ,`Contact_ID` integer NOT NULL ,`Phone_Type` varchar(45)  ,`Area_Code` varchar(45) ,`Number` varchar(45) ,PRIMARY KEY (`Phone_ID`), KEY `fkIdx_56` (`Contact_ID`), CONSTRAINT `FK_56` FOREIGN KEY `fkIdx_56` (`Contact_ID`) REFERENCES `Contact_Names` (`Contact_ID`) ON UPDATE CASCADE ON DELETE CASCADE);")
    cursor.execute("CREATE TABLE `Contact_Dates`(`Date_ID` integer NOT NULL AUTO_INCREMENT ,`Contact_ID` integer NOT NULL ,`Date_Type`  varchar(45) ,`Date` varchar(45) ,PRIMARY KEY (`Date_ID`),KEY `fkIdx_65` (`Contact_ID`),CONSTRAINT `FK_65` FOREIGN KEY `fkIdx_65` (`Contact_ID`) REFERENCES `Contact_Names` (`Contact_ID`) ON UPDATE CASCADE ON DELETE CASCADE);")
    cursor.execute("CREATE TABLE `Contact_Address`(`Address_ID` integer NOT NULL AUTO_INCREMENT ,`Contact_ID` integer NOT NULL ,`Address_Type` varchar(45) , `Address` varchar(45) ,`City` varchar(45) ,`State` varchar(45) ,`Zip_Code` varchar(45) , PRIMARY KEY (`Address_ID`),KEY `fkIdx_23` (`Contact_ID`),CONSTRAINT `FK_23` FOREIGN KEY `fkIdx_23` (`Contact_ID`) REFERENCES `Contact_Names` (`Contact_ID`) ON UPDATE CASCADE ON DELETE CASCADE);")


def InsertIntoRest(dict_data):
    contact_address_query_home = ("INSERT INTO contact_address(Contact_ID, Address_Type, Address, City, State, Zip_Code )" "VALUES ((SELECT Contact_ID from contact_names WHERE Contact_ID = %s),%s,%s,%s,%s,%s);")
    cursor.execute(contact_address_query_home,(dict_data["Contact_ID"],"Home",dict_data['Address_Home'],dict_data['City_Home'],dict_data['State_Home'],dict_data['Zip_Home']))

    contact_address_query_work = ("INSERT INTO contact_address(Contact_ID, Address_Type, Address, City, State, Zip_Code )" "VALUES ((SELECT Contact_ID from contact_names WHERE Contact_ID = %s),%s,%s,%s,%s,%s);")
    cursor.execute(contact_address_query_work,(dict_data["Contact_ID"],"Work",dict_data['Address_Work'],dict_data['City_Work'],dict_data['State_Work'],dict_data['Zip_Work']))

    if(dict_data["Home_Phone"] != " "):
        contact_phone_query_home = ("INSERT INTO contact_phone(Contact_ID, Phone_Type, Area_Code, Number)" "VALUES((SELECT Contact_ID from contact_names WHERE Contact_ID = %s),%s,%s,%s);")
        cursor.execute(contact_phone_query_home,(dict_data["Contact_ID"],"Home",dict_data["Home_Phone"][0:3],dict_data["Home_Phone"][4:]))
    if(dict_data['Work_Phone'] != " "):
        contact_phone_query_work = ("INSERT INTO contact_phone(Contact_ID, Phone_Type, Area_Code, Number)" "VALUES((SELECT Contact_ID from contact_names WHERE Contact_ID = %s),%s,%s,%s);")
        cursor.execute(contact_phone_query_work,(dict_data["Contact_ID"],"Work",dict_data["Work_Phone"][0:3],dict_data["Work_Phone"][4:]))

    if(dict_data['Cell_Phone'] != " "):
        contact_phone_query_cell = ("INSERT INTO contact_phone(Contact_ID, Phone_Type, Area_Code, Number)" "VALUES((SELECT Contact_ID from contact_names WHERE Contact_ID = %s),%s,%s,%s);")
        cursor.execute(contact_phone_query_cell,(dict_data["Contact_ID"],"Cell",dict_data["Cell_Phone"][0:3],dict_data["Cell_Phone"][4:]))

    contact_dates_query = ("INSERT INTO contact_dates(Contact_ID, Date_Type, Date)" "VALUES((SELECT Contact_ID from contact_names WHERE Contact_ID = %s),%s,%s)")
    cursor.execute(contact_dates_query,(dict_data['Contact_ID'],"",dict_data['Date']))
    connection.commit()
def InsertIntoTableNames(dict_data):
    print(dict_data)
    contact_names_query = ("INSERT INTO contact_names(First_Name, Middle_Name, Last_Name)" "VALUES (%s, %s, %s);")
    cursor.execute(contact_names_query, (dict_data["First_Name"],dict_data["Middle_Name"],dict_data["Last_Name"]))
    connection.commit()
    InsertIntoRest(dict_data)
    
try:
    connection = mysql.connector.connect(host='127.0.0.1',
                                         database='contacts',
                                         user='root',
                                         password='Database123!@#',
                                         auth_plugin='mysql_native_password')
    if connection.is_connected():
        db_Info = connection.get_server_info()
        print("Connected to MySQL Server version ", db_Info)
        cursor = connection.cursor()
        cursor.execute("select database();")
        record = cursor.fetchone()
        print("You're connected to database: ", record)

except Error as e:
    print("Error while connecting to MySQL", e)

fields = [] 
rows = [] 
contact = []
# reading csv file 
with open('Contacts.csv', 'r') as csvfile: 
    # creating a csv reader object 
    csvreader = csv.reader(csvfile) 
      
    # extracting field names through first row 
    fields = next(csvreader) 
  
    # extracting each data row one by one 
    for row in csvreader: 
        for idx,values in enumerate(row):
            rows.append(values)
        contact.append(rows)
        rows=[]
print(len(contact))

#Create the TABLES with the Keys and key constraints
CreateTables()

Columns = ['Contact_ID','First_Name',"Middle_Name","Last_Name","Home_Phone","Cell_Phone","Address_Home","City_Home","State_Home","Zip_Home","Work_Phone","Address_Work","City_Work","State_Work","Zip_Work","Date"]

data_dict = dict(zip(Columns, [None]*len(Columns)))
#Inserting Data into the tables

for index,detail in enumerate(contact):
    value=[]
    for idx,val in enumerate(detail):
        if val=="":
            data_dict[Columns[idx]] = " "
        else:
            data_dict[Columns[idx]] = val
    val = data_dict
    InsertIntoTableNames(val)

    # InsertIntoTable(val)
# printing the field names
# 

numb=""
print(numb[0:3],numb[4:])
print('Field names are:' + ', '.join(field for field in fields)) 
  
# #  printing first 5 rows 
# print('\nFirst 5 rows are:\n') 
# for row in rows[:5]: 
#     # parsing each column of a row 
#     for col in row: 
#         print("%10s"%col), 
#     print('\n')

# CREATE TABLE `Contact_Names`
# (
#  `Contact_ID`  integer NOT NULL AUTO_INCREMENT ,
#  `First_Name`  varchar(45) NOT NULL ,
#  `Middle_Name` varchar(45) NOT NULL ,
#  `Last_Name`   varchar(45) NOT NULL ,

# PRIMARY KEY (`Contact_ID`)
# );

# CREATE TABLE `Contact_Phone`
# (
#  `Phone_ID`   integer NOT NULL AUTO_INCREMENT ,
#  `Contact_ID` integer NOT NULL ,
#  `Phone_Type` varchar(45) NOT NULL ,
#  `Area_Code`  integer NOT NULL ,
#  `Number`     integer NOT NULL ,

# PRIMARY KEY (`Phone_ID`),
# KEY `fkIdx_56` (`Contact_ID`),
# CONSTRAINT `FK_56` FOREIGN KEY `fkIdx_56` (`Contact_ID`) REFERENCES `Contact_Names` (`Contact_ID`)
# ON UPDATE CASCADE
# ON DELETE CASCADE
# );

# CREATE TABLE `Contact_Dates`
# (
#  `Date_ID`    integer NOT NULL AUTO_INCREMENT ,
#  `Contact_ID` integer NOT NULL ,
#  `Date_Type`  varchar(45) NOT NULL ,
#  `Date`       date NOT NULL ,

# PRIMARY KEY (`Date_ID`),
# KEY `fkIdx_65` (`Contact_ID`),
# CONSTRAINT `FK_65` FOREIGN KEY `fkIdx_65` (`Contact_ID`) REFERENCES `Contact_Names` (`Contact_ID`)
# ON UPDATE CASCADE
# ON DELETE CASCADE
# );


# CREATE TABLE `Contact_Address`
# (
#  `Address_ID`  integer NOT NULL AUTO_INCREMENT ,
#  `Contact_ID`  integer NOT NULL ,
#  `Street_Name` varchar(45) NOT NULL ,

# PRIMARY KEY (`Address_ID`),
# KEY `fkIdx_23` (`Contact_ID`),
# CONSTRAINT `FK_23` FOREIGN KEY `fkIdx_23` (`Contact_ID`) REFERENCES `Contact_Names` (`Contact_ID`)
# ON UPDATE CASCADE
# ON DELETE CASCADE
# );

# CREATE TABLE `Contact_Zip_Code`
# (
#  `Zip_Code` integer NOT NULL ,
#  `City`    varchar(45) NOT NULL ,
#  `State`   varchar(45) NOT NULL ,

# PRIMARY KEY (`Zip_Code`)
# );

# CREATE TABLE `Address_Type`
# (
#  `Address_ID`   integer NOT NULL ,
#  `Address_Type` varchar(45) NOT NULL ,
#  `Zip_Code`      integer NOT NULL ,

# KEY `fkIdx_34` (`Address_ID`),
# CONSTRAINT `FK_34` FOREIGN KEY `fkIdx_34` (`Address_ID`) REFERENCES `Contact_Address` (`Address_ID`),
# KEY `fkIdx_52` (`Zip_Code`),
# CONSTRAINT `FK_52` FOREIGN KEY `fkIdx_52` (`Zip_Code`) REFERENCES `Contact_Zip_Code` (`Zip_Code`)
# ON DELETE CASCADE
# ON UPDATE CASCADE
# );
