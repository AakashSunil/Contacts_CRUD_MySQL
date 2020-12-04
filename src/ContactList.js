/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Button, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 500,
  },
  li: {
    
  }
});

export default function ContactsList() {
  const history = useHistory();
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [tablerows,setTableRows] = React.useState([]);
  const [searchData, setSearchData] = React.useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = (row,type) => {
    if(type==='Update') {
      history.push('/editContact/'+row.id,{id:row.id})
    }
    else {
      history.push('/deleteContact/'+row.id,{id:row.id})
    }
  }

  const handleSearchChange = async(data) => {
    setSearchData(data)
    if(data.trim() === "")
    {
      try {
				const res = await fetch('http://localhost:3001/contacts');
				const contacts = await res.json();
				createRows(contacts)
			} catch (error) {
				console.log(error);
			}
    }
  }
  const handleSearch = async (data) => {
    try {
				const res = await fetch('http://localhost:3001/contacts/search/'+ data);
				const contacts = await res.json();
        createRows(contacts)
		} catch (error) {
				console.log(error);
		}

    
  }

  React.useEffect(() => {	
		(async () => {
			try {
				const res = await fetch('http://localhost:3001/contacts');
				const contacts = await res.json();
				createRows(contacts)
			} catch (error) {
				console.log(error);
			}
		})();
	},[]);    

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
        address:split_value[2]
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
		setTableRows(rows)
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
		{
			id:6,
			column_header:'Edit'
		},
		{
			id:7,
			column_header:'Delete'
		}
	]


  return (
    <div>
      <div>
        <TextField
            id="outlined-helperText"
            onChange={(event)=>handleSearchChange(event.target.value)}
        />
        <Button onClick={()=>handleSearch(searchData)}>Search</Button>
      </div>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                  >
                    {column.column_header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            
              {tablerows.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map((row) => {
                
            return (
              <TableBody>
              <TableRow >
                <TableCell >
                  {row.id}
                </TableCell>
                <TableCell >
                  {row.name}
                </TableCell>
                <TableCell >
                  {row.address.map(address_value=>{
                    return <ul style={{listStyleType:'none', padding:0}}>
                      <li><b>{address_value.address.trim() !== ", , ,"?address_value.address_type:""}</b></li>
                      <li>{address_value.address.trim() !== ", , ,"?address_value.address.replace(" , , ,",""):""}</li>
                    </ul>
                  })}
                </TableCell>
                <TableCell >
                  {row.phone.map(phone_value=>{
                    return <ul style={{listStyleType:'none', padding:0}}>
                    {phone_value.area_code.trim() !== "" && phone_value.number.trim() !== "" &&<li ><b>{phone_value.phone_type}</b></li>}
                    {phone_value.area_code.trim() !== "" &&<li> <b>{'Area Code: '}</b>{phone_value.area_code}</li>}
                    {phone_value.number.trim() !== "" &&<li><b>{'Number: '}</b>{phone_value.number}</li>}
                    </ul>
                  })}
                </TableCell>
                <TableCell >
                  {row.date.map(date_value=>{
                    return <ul style={{listStyleType:'none', padding:0}}>
                      <li><b>{date_value.date_type}</b></li>
                      <li>{date_value.date}</li>
                    </ul>
                  })}
                </TableCell>
                <TableCell >
                  <Button 
                    onClick={()=>handleClick(row,'Update')}
                  >{row.edit}</Button>
                </TableCell>
                <TableCell >
                  <Button 
                    onClick={()=>handleClick(row,'Delete')}
                  >{row.deleted}</Button>
                </TableCell>
              </TableRow>
            </TableBody>

            );
            })}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={tablerows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}