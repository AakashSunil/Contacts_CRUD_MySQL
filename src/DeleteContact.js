/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useState } from 'react';
import {
  useHistory,
  useLocation
} from "react-router-dom";


export default function DeleteContact() {
  const history = useHistory();
  const id  = useLocation();
  const details = id.state.id;
  const [contact,setContact] = useState([]);
  const [data,setData] = useState(false)

const createData = (id,names, addresses, phones, dates, edit,deleted) => {
    const name_split = names.split("~")
    const name = name_split.join(' ')
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
      var address_splits = {
        address_ID: split_value[0],
        address_type:split_value[1],
        address:split_value[2].replace(/\|/g,',',)
      }
      return address_splits
    })

    const date = date_split.map(value =>{
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
    return { id,name, address, phone, date, edit,deleted };
	}

  const createRows = (contacts) => {
		var rows = []
		rows = contacts.map((contact,id) => {
			return createData(contact.Contact_ID,contact.Name,contact.Address,contact.Phones,contact.Dates,'edit',"delete")
		})
		setContact(rows[0])
    setData(true)
	}    

  React.useEffect(() => {	
		(async () => {
			try {
				const res = await fetch('https://contacts-mysql-data.herokuapp.com/contacts/'+details);
				const contacts = await res.json();
        console.log(contacts);
        createRows(contacts)
			} catch (error) {
				console.log(error);
			}
		})();
	},[]);
  
  const handleClick = (choice) => {
    if(choice === 'Delete') {
      fetch('https://contacts-mysql-data.herokuapp.com/contacts/'+contact.id,{
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })
      .then(res => {
        return res.json()
      })
      .then(json => {
        console.log(json)
      })
    }
    history.push('/')
  }
  const columns = [
    {
		  id:1,
		  column_header:'Contact ID'
	  },
	  {
	  	id:2,
	  	column_header:'Name'
	  },
	  {
	  	id:3,
	  	column_header:'Addresses'
	  },
	  {
	  	id:4,
	    column_header:'Phones'
	  },
	  {
		  id:5,
		  column_header:'Dates'
	  },	
	]
  return (
  <div>
    <center>
      <h2>Delete Contact</h2>
      <h4>Details</h4>
      {data && <TableContainer >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => {
                return <TableCell key={column.id}>
                  {column.column_header}
                </TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data && <TableRow>
              <TableCell >
                {contact.id}
              </TableCell>
              <TableCell>
                {contact.name}
              </TableCell>
              <TableCell>
                {contact.address.map(address_value => {
                  return <ul style={{listStyleType:'none', padding:0}}>
                    <li><b>{address_value.address.trim() !== ", , ,"?address_value.address_type:""}</b></li>
                    <li>{address_value.address.trim() !== ", , ,"?address_value.address.replace(" , , ,",""):""}</li>
                  </ul>
                })}
              </TableCell>
              <TableCell>
                {contact.phone.map(phone_value=>{
                  return <ul style={{listStyleType:'none', padding:0}}>
                    {phone_value.area_code.trim() !== "" && phone_value.number.trim() !== "" &&<li ><b>{phone_value.phone_type}</b></li>}
                    {phone_value.area_code.trim() !== "" &&<li><b>{'Area Code: '}</b>{phone_value.area_code}</li>}
                    {phone_value.number.trim() !== "" &&<li><b>{'Number: '}</b>{phone_value.number}</li>}
                  </ul>
                })}
              </TableCell>
              <TableCell >
                {contact.date.map(date_value => {
                  return <ul style={{listStyleType:'none', padding:0}}>
                    <li><b>{date_value.date_type}</b></li>
                    <li>{date_value.date}</li>
                  </ul>
                })}
              </TableCell>
            </TableRow>}
          </TableBody>
        </Table>
      </TableContainer>}
      <h3>Are you sure to delete the above contact from the database?</h3>
      <Button onClick={()=>handleClick('Delete')}>Delete</Button>
      <Button onClick={()=>handleClick('Cancel')}>Cancel</Button>
    </center>
  </div>)
}
