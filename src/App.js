import React from 'react';
import ContactList from './ContactList';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import { Button } from '@material-ui/core';
import AddContactForm from './AddContactForm';
import EditContact from './EditContact';
import DeleteContact from './DeleteContact';

export default function App(){

    
    return <div>
        <h1><center>Contact Management System</center></h1>
        <Router>
        <div>
            <Button><Link to='/addContactForm'>Add Contact Form</Link></Button>
            <Button><Link to='/'>Contact List</Link></Button>
            <Switch>
            <Route exact path="/">
                <ContactList />
            </Route>
            <Route path="/addContactForm">
                <AddContactForm />
            </Route>
            <Route path="/editContact/:id">
                <EditContact />
            </Route>
            <Route path="/deleteContact/:id">
                <DeleteContact />
            </Route>
            </Switch>
        </div>
        </Router>
    </div>
}
