import { GlobalStyle } from '../global-style';
import { Component } from "react";
import { AddContact } from './newContact/NewContact';
import { Filter } from './filter/Filter';
import { ContactList } from './contactList/ContactList';
import { nanoid } from 'nanoid';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  async componentDidMount() { 
  const savedContacts = await localStorage.getItem("contacts");
  
  if (savedContacts !== null) {
    const parsedContacts = JSON.parse(savedContacts);
    this.setState({ contacts: parsedContacts });
  };
};

componentDidUpdate(prevProps, prevState) {
  if (prevState.contacts !== this.state.contacts) {
    localStorage.setItem("contacts", JSON.stringify(this.state.contacts));
  };
};

createContact = (values) => {
  const targetContact = this.state.contacts
    .map((cont) => cont.name.toLowerCase())
    .includes(values.name.toLowerCase());

    if (targetContact) {
      alert(`${values.name} is already in contacts`);
    } else {
      values.id = nanoid();
      this.setState(prevState => {
        return {
          contacts: [...prevState.contacts, values],
        };
      });
  };
  
};

changeFilter = searchValue => {
  this.setState({filter: `${searchValue.target.value}`});
}

handleDelete = (contactId) => {
  this.setState(prevState => {
    return {
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    };
  });
};

  render() {
    const { contacts, filter } = this.state;
    const actualContacts = contacts.filter(contact => contact.name.toLowerCase().includes(filter.toLowerCase()));
    return (
    <>
      <GlobalStyle />
      <AddContact create={this.createContact} />
      <div>
        <Filter onFilter={this.changeFilter} initValue={this.state.filter}/>
        <ContactList actual={actualContacts} onDelete={this.handleDelete}/>
      </div>
    </>
  );
  };
};