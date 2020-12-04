/* eslint-disable no-multi-str */
const mysql = require('mysql')
const express = require('express');
var app = express()
var cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(cors())
var mysqlConnection = mysql.createConnection({
    host:'127.0.0.1',
    user: 'root',
    password: 'password',
    database: 'contacts',
    multipleStatements: true
})
mysqlConnection.connect((err) => {
    if(!err) {
        console.log('DB Connection Successful')
    } 
    else {
        console.log('DB Connection failed \n Error: '+ JSON.stringify(err,undefined,2));
    }
})
 app.listen(3001,()=>{console.log('Express Server is running at port 3001')})


//Landing Page - List of Contacts
app.get('/contacts',(req,res)=>{
    // eslint-disable-next-line no-multi-str
    mysqlConnection.query('SELECT distinct CN.Contact_ID,CONCAT(CN.First_Name,"~",CN.Middle_Name,"~",CN.Last_Name) AS Name, \
    group_concat(distinct concat(CA.Address_ID,"~",CA.Address_Type,"~",CA.Address,",",CA.City,",",CA.State,",",CA.Zip_Code) SEPARATOR"~~") AS Address, \
    GROUP_CONCAT(DISTINCT CONCAT(CP.Phone_ID,"|",CP.Phone_Type,"|",CP.Area_Code,"|",CP.Number) SEPARATOR "~~") as Phones, \
    GROUP_CONCAT(DISTINCT CONCAT(CD.Date_ID,"|",CD.Date_Type,"~",CD.Date) SEPARATOR "~~") as Dates \
    from contact_names as CN, contact_address as CA, contact_dates as CD, contact_phone as CP \
    where CN.Contact_ID = CA.Contact_ID AND CN.Contact_ID = CD.Contact_ID AND CN.Contact_ID = CP.Contact_ID \
    group by CA.Contact_ID, CP.Contact_ID,CD.Contact_ID;',(err,rows,fields) => {
        if(!err) {
            res.send(rows)
        }
        else {
            console.log(err);
        }
    })
})

// Particular Contact using Contact ID
app.get('/contacts/:id',(req,res)=>{
    // eslint-disable-next-line no-multi-str
    mysqlConnection.query('SELECT distinct CN.Contact_ID,CONCAT(CN.First_Name,"~",CN.Middle_Name,"~",CN.Last_Name) AS Name, \
    group_concat(distinct concat(CA.Address_ID,"~",CA.Address_Type,"~",CA.Address,",",CA.City,",",CA.State,",",CA.Zip_Code) SEPARATOR"~~") AS Address, \
    GROUP_CONCAT(DISTINCT CONCAT(CP.Phone_ID,"|",CP.Phone_Type,"|",CP.Area_Code,"|",CP.Number) SEPARATOR "~~") as Phones, \
    GROUP_CONCAT(DISTINCT CONCAT(CD.Date_ID,"|",CD.Date_Type,"~",CD.Date) SEPARATOR "~~") as Dates \
    from contact_names as CN, contact_address as CA, contact_dates as CD, contact_phone as CP \
    where CN.Contact_ID = CA.Contact_ID AND CN.Contact_ID = CD.Contact_ID AND CN.Contact_ID = CP.Contact_ID AND CN.Contact_ID = ?\
    group by CA.Contact_ID, CP.Contact_ID,CD.Contact_ID;',[req.params.id],(err,rows,fields) => {
        if(!err) {
            res.send(rows)
        }
        else {
            console.log(err);
        }
    })
})

app.get('/contacts/search/:key',(req,res)=>{
    var search_query = `SELECT Contact_ID FROM contact_names as cn WHERE MATCH(cn.First_Name,cn.Middle_Name,cn.Last_Name) AGAINST (? IN NATURAL LANGUAGE MODE)
    UNION
    SELECT Contact_ID FROM contact_address as ca WHERE MATCH(ca.Address_Type,ca.Address,ca.City,ca.State,ca.Zip_Code) AGAINST (? IN NATURAL LANGUAGE MODE)
    UNION
    SELECT Contact_ID FROM contact_phone as cp WHERE MATCH(cp.Phone_Type,cp.Area_Code,cp.Number) AGAINST (? IN NATURAL LANGUAGE MODE)
    UNION
    SELECT Contact_ID FROM contact_dates as cd WHERE MATCH(cd.Date_Type,cd.Date) AGAINST (? IN NATURAL LANGUAGE MODE);`

    var search_results = 'SELECT distinct CN.Contact_ID,CONCAT(CN.First_Name,"~",CN.Middle_Name,"~",CN.Last_Name) AS Name, \
    group_concat(distinct concat(CA.Address_ID,"~",CA.Address_Type,"~",CA.Address,",",CA.City,",",CA.State,",",CA.Zip_Code) SEPARATOR"~~") AS Address, \
    GROUP_CONCAT(DISTINCT CONCAT(CP.Phone_ID,"|",CP.Phone_Type,"|",CP.Area_Code,"|",CP.Number) SEPARATOR "~~") as Phones, \
    GROUP_CONCAT(DISTINCT CONCAT(CD.Date_ID,"|",CD.Date_Type,"~",CD.Date) SEPARATOR "~~") as Dates \
    from contact_names as CN, contact_address as CA, contact_dates as CD, contact_phone as CP \
    where CN.Contact_ID = CA.Contact_ID AND CN.Contact_ID = CD.Contact_ID AND CN.Contact_ID = CP.Contact_ID AND CN.Contact_ID IN ?\
    group by CA.Contact_ID, CP.Contact_ID,CD.Contact_ID;'
    var input = [req.params.key]
    searchList(search_query,input).then((results_search)=>{
        modified_contact_list(search_results,[results_search]).then((result_modified_contacts)=>{
            res.send(result_modified_contacts)
        })
    })
})

function modified_contact_list(sql,input) {
    return new Promise(function(resolve,reject){
        mysqlConnection.query(sql,[input],(err,rows,fields) => {
            if(!err) {
                resolve(rows)
            }
            else {
                console.log(err);
                reject(err)
            }
        })
    })
}
function searchList(sql,input) {
    return new Promise(function(resolve,reject){
        mysqlConnection.query(sql,[input,input,input,input],(err,rows,fields) => {
            var contacts = []
            if(!err) {
                rows.map((value,index)=>{
                    contacts.push(value.Contact_ID);
                })
                if(contacts.length<1) {
                    contacts.push(null)
                }
                resolve(contacts)
            }
            else {
                console.log(err);
                reject(err)
            }
        })
    })
}

// Delete Particular Contact using Contact ID
app.delete('/contacts/:id',(req,res)=>{
    mysqlConnection.query('DELETE FROM CONTACT_NAMES WHERE CONTACT_NAMES.CONTACT_ID = ?',[req.params.id],(err,rows,fields) => {
        if(!err) {
            res.send('Deleted Contact '+[req.params.id]+' successfully')
        }
        else {
            console.log(err);
        }
    })
})

// New Contact
app.post('/contacts/:id', (req,res) => {
    let contact = req.body
    // eslint-disable-next-line no-multi-str
    var sql='INSERT INTO CONTACT_NAMES(First_Name,Middle_Name,Last_Name) VALUES (?,?,?);'
    var sql_address='INSERT INTO CONTACT_ADDRESS(Address_Type,Address,City,State,Zip_Code,Contact_ID) VALUES ?;'
    var sql_phone='INSERT INTO CONTACT_PHONE(Phone_Type,Area_code,Number,Contact_ID) VALUES ?;'
    var sql_date='INSERT INTO CONTACT_DATES(Date_Type,Date,Contact_ID) VALUES ?;'        

    getID(sql,[contact.first_name,contact.middle_name,contact.last_name]).then((result_names)=>{
        var temp_address = contact.address.map((value,index)=>{
            var temp = value
            temp.push(result_names)
            return temp
        })
        var temp_phone = contact.phone.map((value,index)=>{
            var temp = value
            temp.push(result_names)
            return temp
        })
        var temp_date = contact.date.map((value,index)=>{
            var temp = value
            temp.push(result_names)
            return temp
        })
        getID(sql_address,[temp_address]).then((result_address)=>{
            getID(sql_phone,[temp_phone]).then((result_phone)=>{
                getID(sql_date,[temp_date]).then((result_date)=>{
                    res.json({
                        message:'Contact Details Added Successfully'
                    })     
                }).catch((err)=>{
                    res.json({
                        message:'Contact Details not added. Date Details Failed'
                    })
                    removeID(result_names)
                })
            }).catch((err) => {
                res.json({
                    message:'Contact Details not added. Phone Details Failed'
                })
                removeID(result_names)
            })
        }).catch((err)=>{
            res.json({
                message:'Contact Details not added. Address Details Failed'
            })
            removeID(result_names)
        })
    }).catch((err)=>{
        console.log(err);
        res.json({
            message:'Contact Details not added.'
        })
        removeID(err)
    })    
})

function getID(sql,input) {
    return new Promise(function(resolve,reject){
        mysqlConnection.query(sql,input,(error,rows,fields)=>{
            if(!error) {
                resolve(rows.insertId)
            }
            else {
                reject(rows.insertId)
            }
        })
    })
}
function removeID(input) {
    return new Promise(function(resolve,reject) {
        mysqlConnection.query('DELETE FROM CONTACT_NAMES WHERE CONTACT_NAMES.CONTACT_ID = ?',[input],(err,rows,fields) => {
            if(!err) {
                resolve(rows)
            }
            else {
                reject(err)
            }
        })
    })
}

function updateID(sql,input) {
    return new Promise(function(resolve,reject){
        mysqlConnection.query(sql,input,(error,rows,fields)=>{
            if(!error) {
                resolve(rows)
            }
            else {
                console.log(error);
                reject(rows)
            }
        })
    })
}
// Update Particular Contact using Contact ID
app.put('/contacts/update/:id', (req,res) => {
    let contact = req.body
    console.log(contact);    // eslint-disable-next-line no-multi-str
    var sql=`UPDATE CONTACT_NAMES SET First_Name = ?, Middle_Name = ?, Last_Name = ? WHERE Contact_ID = ?;`
    
    var sql_address='INSERT INTO CONTACT_ADDRESS(Address_ID,Contact_ID,Address_Type,Address,City,State,Zip_Code) VALUES ? \
    ON DUPLICATE KEY UPDATE Address_ID = VALUES(Address_ID), Contact_ID = VALUES(Contact_ID), Address_Type = VALUES(Address_Type), \
    Address = VALUES(Address), City = VALUES(City), State = VALUES(State), Zip_Code = VALUES(Zip_Code);'

    var sql_phone='INSERT INTO CONTACT_PHONE(Phone_ID,Contact_ID,Phone_Type,Area_code,Number) VALUES ? \
    ON DUPLICATE KEY UPDATE Phone_ID = VALUES(Phone_ID), Contact_ID = VALUES(Contact_ID), Phone_Type = VALUES(Phone_Type), \
    Area_Code = VALUES(Area_Code), Number = VALUES(Number);'
    
    var sql_date='INSERT INTO CONTACT_DATES(Date_ID,Contact_ID,Date_Type,Date) VALUES ? \
    ON DUPLICATE KEY UPDATE Date_ID = VALUES(Date_ID), Contact_ID = VALUES(Contact_ID), Date_Type = VALUES(Date_Type), Date = VALUES(Date);'        

    updateID(sql,[contact.first_name,contact.middle_name,contact.last_name,contact.contact_id]).then((result)=>{
        updateID(sql_address,[contact.address]).then((result)=>{
            updateID(sql_phone,[contact.phone]).then((result)=>{
                updateID(sql_date,[contact.date]).then((result)=>{
                    res.json({
                        message:'Contact Updated Successfully'
                    })
                }).catch((err)=>{
                    res.json({
                        message:'Contact Not Updated Successfully. Issue in Date Value'
                    })
                })
            }).catch((err)=>{
                res.json({
                    message:'Contact Not Updated Successfully. Issue in Phone Value'
                })
            })
        }).catch((err)=>{
            res.json({
                message:'Contact Not Updated Successfully. Issue in Address Value'
            })
        })
    }).catch((err)=>{
        res.json({
            message:'Contact Not Updated Successfully.'
        })
    })
    
})