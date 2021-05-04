/* eslint-disable react-hooks/exhaustive-deps */
import { Button, MenuItem, TextField } from '@material-ui/core';
import React, { useState } from 'react';

import {
  useHistory,
  useLocation
} from "react-router-dom";

const address_types = [
  {
    value:'Home',
    label:'Home'
  },
  {
    value:'Work',
    label:'Work'
  },
  {
    value:'Other',
    label:'Other'
  }
]

const phone_types = [
  {
    value:'Home',
    label:'Home'
  },
  {
    value:'Work',
    label:'Work'
  },
  {
    value:'Cell',
    label:'Cell'
  }
]

const date_types = [
  {
    value:'Birth Date',
    label:'Birth Date'
  },
  {
    value:'Other',
    label:'Other'
  }
]

export default function EditContact() {
  const history = useHistory();
  const id  = useLocation();
  const details = id.state.id;
  const [contact,setContact] = useState("");
  const [data,setData] = useState(false)

  const [firstName,setFirstName] = React.useState("")
  const [middleName,setMiddleName] = React.useState("")
  const [lastName,setLastName] = React.useState("")

  var addressArrayBlank = {address_type:"",address:"",city:"",state:"",zip_code:"",contact_id:String(details),address_id:"0"}
  var phoneArrayBlank = {phone_type:"",area_code:"",number:"",contact_id:String(details),phone_id:"0"}
  var dateArrayBlank = {date_type:"",date:"",contact_id:String(details),date_id:"0"}

  const [addressArray,setAddressArray] = React.useState([])
  const [phoneArray,setPhoneArray] = React.useState([])
  const [dateArray,setDateArray] = React.useState([])

  const checkAddress = (row) => {
    if(row.address_id === "0")
      return true
    return false
  }

  const checkPhone = (row) => {
    if(row.phone_id === "0")
      return true
    return false
  }

  const checkDate = (row) => {
    if(row.date_id === "0")
      return true
    return false
  }



  const createRows = (contacts) => {
		var rows = []
		rows = contacts.map((contact) => {
			return createData(contact.Contact_ID,contact.Name,contact.Address,contact.Phones,contact.Dates,'edit',"delete")
		})
    setValues(rows[0])
	}    

  React.useEffect(() => {	
		(async () => {
			try {
				const res = await fetch('https://contacts-mysql-data.herokuapp.com/contacts/'+details);
				const contacts = await res.json();
        createRows(contacts)
			} catch (error) {
				console.log(error);
			}
		})();
	},[]);

  const handleClick = async (choice) => {
    let address_body = addressArray.map((row,index)=>{
      console.log(row,'ss');
      return ([row.address_id,contact,row.address_type,row.address,row.city,row.state,row.zip_code])
    })
    
    let phone_body = phoneArray.map((row,index)=>{
      return ([row.phone_id,contact,row.phone_type,row.area_code,row.number])
    })

    let date_body = dateArray.map((row,index)=>{
      return ([row.date_id,contact,row.date_type,row.date])
    })

    let contact_body = {
      contact_id:contact,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      address: address_body,
      phone: phone_body,
      date: date_body
    }
    console.log(contact_body);

    if(choice === 'Update') {
      var response = await fetch('https://contacts-mysql-data.herokuapp.com/contacts/update/'+contact, {
        method: 'PUT',
        body: JSON.stringify(contact_body),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then(res => {
        return res.json()
      })
      .catch(json => {
        return json.json()
      })
      alert(response.message);
    }
    history.push('/')
  }

  const createData = (id,names, addresses, phones, dates, edit,deleted) => {
    const name_split = names.split("~")
    const name_values = {
      firstName: name_split[0],
      middleName: name_split[1],
      lastName: name_split[2]
    }

    const address_split = addresses.split("~~")
    const phone_split = phones.split("~~")
    const date_split = dates.split("~~")
      
    const phone = phone_split.map(value =>{
        var split_value = (value.split('|'))
        var phone_splits = {
          phone_id: split_value[0],
          phone_type:split_value[1],
          area_code:split_value[2],
          number:split_value[3]
        }
        return phone_splits
      })

    const address = address_split.map(value =>{
        var split_value = (value.split('~'))
        console.log(split_value);
        var address_value = split_value[2].split(',')
        console.log(address_value);
        var address_splits = {
          address_id: split_value[0],
          address_type:split_value[1],
          address: address_value[0],
          city:address_value[1],  
          state:address_value[2],
          zip_code:address_value[3]
        }
        return address_splits
      })

    const date = date_split.map(value => {
      var split_value = (value.split('|'))
      var date_details = split_value[1]
      var date_details_split = date_details.split('~')
      var date_splits = {
        date_id:split_value[0],
        date_type:date_details_split[0],
        date:date_details_split[1]
      }
      return date_splits
      
    })
    
    return { id,name_values, address, phone, date, edit,deleted };
	}

  const setValues = (data) => {
		setContact(data.id)
    setFirstName(data.name_values.firstName)
    setMiddleName(data.name_values.middleName)
    setLastName(data.name_values.lastName)
    setAddressArray(data.address)
    setPhoneArray(data.phone)
    setDateArray(data.date)
    setData(true)
  }

  const handleAddress = () =>{
    setAddressArray([...addressArray,addressArrayBlank])
  }

  const handleRemoveAddress = (e,row,i) => {
    setAddressArray(addressArray.filter((row,index)=>index !== i))
  }

  const handlePhone = () =>{
    setPhoneArray([...phoneArray,phoneArrayBlank])
  }

  const handleRemovePhone = (e,row,i) => {
    setPhoneArray(phoneArray.filter((row,index)=>index !== i))
  }

  const handleDate = () =>{
    setDateArray([...dateArray,dateArrayBlank])
  }

  const handleRemoveDate = (e,row,i) => {
    setDateArray(dateArray.filter((row,index)=>index !== i))
  }

  const handleAddressValue = (e,index,attr) => {
    let tempAddress = [...addressArray]
    tempAddress[index][attr] = e.target.value
    setAddressArray(tempAddress)
  }
  
  const handlePhoneValue = (e,index,attr) => {
    let tempAddress = [...phoneArray]
    tempAddress[index][attr] = e.target.value
    setPhoneArray(tempAddress)
  }

  const handleDateValue = (e,index,attr) => {
    let tempAddress = [...dateArray]
    tempAddress[index][attr] = e.target.value
    setDateArray(tempAddress)
  }
  return (
    <div>
      <center>
        <h2>Edit Contact</h2>
        <h4>Details</h4>
        {data && 
        
        <form>
          <div style={{padding:'10px'}}>
            <TextField
          id="outlined-helperText"
          label="First Name"
          variant="outlined"
          value={firstName}
          onChange={(e)=>setFirstName(e.target.value)}
        />
        <TextField
          id="outlined-helperText"
          label="Middle Name"
          variant="outlined"
          value={middleName}
          onChange={(e)=>setMiddleName(e.target.value)}
        />
        <TextField
          id="outlined-helperText"
          label="Last Name"
          variant="outlined"
          value={lastName}
          onChange={(e)=>setLastName(e.target.value)}
        />
        {addressArray.map((row,index)=>{
          return(
          <div style={{padding:'10px'}}>
          <TextField
          style={{width:'200px'}}
          select
          id="outlined-helperText"
          label="Address Type"
          defaultValue="Default Value"
          variant="outlined"
          value={row.address_type}
          onChange={(e)=>handleAddressValue(e,index,'address_type')}
        >
          {
              address_types.map((option)=>{
                return <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              })
            }
          </TextField>
        <TextField
          id="outlined-helperText"
          label="Street Address"
          defaultValue="Default Value"
          variant="outlined"
          value={row.address}
          onChange={(e)=>handleAddressValue(e,index,'address')}
        />
        <TextField
          id="outlined-helperText"
          label="City"
          defaultValue="Default Value"
          variant="outlined"
          value={row.city}
          onChange={(e)=>handleAddressValue(e,index,'city')}
        />
        <TextField
          id="outlined-helperText"
          label="State"
          defaultValue="Default Value"
          variant="outlined"
          value={row.state}
          onChange={(e)=>handleAddressValue(e,index,'state')}
        />
        <TextField
          id="outlined-helperText"
          label="Zip Code"
          defaultValue="Default Value"
          variant="outlined"
          value={row.zip_code}
          onChange={(e)=>handleAddressValue(e,index,'zip_code')}
        />
        {checkAddress(row) && addressArray.length > 1 && <Button onClick={(e,value)=>handleRemoveAddress(e,row,index)}>Delete</Button>}
        </div>)
        })}
        <Button onClick={handleAddress}>+ Add Address</Button>

        {phoneArray.map((row,index)=>{
          return(
          <div style={{padding:'10px'}}>
            <TextField
            style={{width:'200px'}}
              select
          id="outlined-helperText"
          label="Phone Type"
          defaultValue="Default Value"
          variant="outlined"
          value={row.phone_type}
          onChange={(e)=>handlePhoneValue(e,index,'phone_type')}
        >
          {
              phone_types.map((option)=>{
                return <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              })
            }
          </TextField>
        <TextField
          id="outlined-helperText"
          label="Area Code"
          defaultValue="Default Value"
          variant="outlined"
          value={row.area_code}
          onChange={(e)=>handlePhoneValue(e,index,'area_code')}
        />
        <TextField
          id="outlined-helperText"
          label="Number"
          defaultValue="Default Value"
          variant="outlined"
          value={row.number}
          onChange={(e)=>handlePhoneValue(e,index,'number')}
        />
        {checkPhone(row) && phoneArray.length > 1 && <Button onClick={(e,value)=>handleRemovePhone(e,row,index)}>Delete</Button>}
          </div>)
        })}
        <Button onClick={handlePhone}>+ Add Phone</Button>
        {
          dateArray.map((row,index)=>{
            return(
          <div style={{padding:'10px'}}>
            <TextField
            style={{width:'200px'}}
          select
          id="outlined-helperText"
          label="Date Type"
          defaultValue="Default Value"
          variant="outlined"
          value={row.date_type}
          onChange={(e)=>handleDateValue(e,index,'date_type')}
        >
          {
              date_types.map((option)=>{
                return <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              })
            }
          </TextField>
        <TextField
          id="outlined-helperText"
          label="Date"
          type="date"
          defaultValue="Default Value"
          variant="outlined"
          value={row.date}
          onChange={(e)=>handleDateValue(e,index,'date')}
        />
        {checkDate(row) && dateArray.length > 1 && <Button onClick={(e,value)=>handleRemoveDate(e,row,index)}>Delete</Button>}
          </div>)
          })
        }
        <Button onClick={handleDate}>+ Add Date</Button>
          </div>
        </form>
      }
        <h3>Are you sure to Update the above contact in the database?</h3>
        <Button onClick={()=>handleClick('Update')}>Update</Button>
        <Button onClick={()=>handleClick('Cancel')}>Cancel</Button>
      </center>
    </div>
  )
}
