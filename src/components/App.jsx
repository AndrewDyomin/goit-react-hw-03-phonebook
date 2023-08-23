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
  const parsedContacts = JSON.parse(savedContacts);
  if (this.state.contacts !== parsedContacts) {
    this.setState({ contacts: parsedContacts });
  };
};

createContact = async (values) => {
  const targetContact = this.state.contacts
    .map((cont) => cont.name.toLowerCase())
    .includes(values.name.toLowerCase());

    if (targetContact) {
      alert(`${values.name} is already in contacts`);
    } else {
      values.id = nanoid();
      await this.setState(prevState => {
        return {
          contacts: [...prevState.contacts, values],
        };
      });
  };
  localStorage.setItem("contacts", JSON.stringify(this.state.contacts));
};

changeFilter = searchValue => {
  this.setState({filter: `${searchValue.target.value}`});
}

handleDelete = async (contactId) => {
  await this.setState(prevState => {
    return {
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    };
  });
  localStorage.setItem("contacts", JSON.stringify(this.state.contacts));
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