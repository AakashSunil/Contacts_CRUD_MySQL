/* eslint-disable react-hooks/exhaustive-deps */
import { Button, MenuItem, TextField } from '@material-ui/core';
import React from 'react';

import {
  useHistory,
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
export default function AddContactForm() {
  const history = useHistory();

  const [firstName,setFirstName] = React.useState("")
  const [middleName,setMiddleName] = React.useState("")
  const [lastName,setLastName] = React.useState("")

  var addressArrayBlank = {address_type:"",address:"",city:"",state:"",zipcode:""}
  var phoneArrayBlank = {phone_type:"",area_code:"",number:""}
  var dateArrayBlank = {date_type:"",date:""}

  const [addressArray,setAddressArray] = React.useState([addressArrayBlank])
  const [phoneArray,setPhoneArray] = React.useState([phoneArrayBlank])
  const [dateArray,setDateArray] = React.useState([dateArrayBlank])

  const handleClick = async (choice) => {
    
    let address_body = addressArray.map((row,index)=>{
      return ([row.address_type,row.address,row.city,row.state,row.zipcode])
    })
    
    let phone_body = phoneArray.map((row,index)=>{
      return ([row.phone_type,row.area_code,row.number])
    })

    let date_body = dateArray.map((row,index)=>{
      return ([row.date_type,row.date])
    })

    let contact_body = {
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      address: address_body,
      phone: phone_body,
      date: date_body
    }
    if(choice === 'Insert') {

      var response = await fetch('https://contacts-mysql-data.herokuapp.com/contacts/'+0, {
        method: 'POST',
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
        <h2>Add New Contact</h2>
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
          value={row.zipcode}
          type={Number}
          onChange={(e)=>handleAddressValue(e,index,'zipcode')}
        />
        {addressArray.length>1 && index === addressArray.length-1&&<Button onClick={(e,value)=>handleRemoveAddress(e,row,index)}>Delete</Button>}
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
        {phoneArray.length>1&&index===phoneArray.length-1&&<Button onClick={(e,value)=>handleRemovePhone(e,row,index)}>Delete</Button>}
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
          defaultValue="Default Value"
          variant="outlined"
          value={row.date}
          onChange={(e)=>handleDateValue(e,index,'date')}
        />
        {dateArray.length>1 && index === dateArray.length-1 && <Button onClick={(e,value)=>handleRemoveDate(e,row,index)}>Delete</Button>}
          </div>)
          })
        }
        <Button onClick={handleDate}>+ Add Date</Button>
          </div>
        </form>
        <Button onClick={()=>handleClick('Insert')}>Insert</Button>
        <Button onClick={()=>handleClick('Cancel')}>Cancel</Button>
      </center>
    </div>
  )
}
