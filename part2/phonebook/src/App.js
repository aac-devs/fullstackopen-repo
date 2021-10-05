import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filteredName, setFilteredName] = useState('');

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPersonHandler = (event) => {
    event.preventDefault();

    if (newNumber.trim() === '') {
      alert('You must enter a phone number');
      return;
    }

    setNewName('');
    setNewNumber('');

    const names = persons.map((person) => person.name.toLowerCase());
    if (names.includes(newName.toLowerCase())) {
      alert(`${newName} is already added to phonebook`);
      return;
    }

    setFilteredName('');

    personService
      .create({ name: newName, number: newNumber })
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
      });
  };

  const inputChangeHandler =
    ({ target }, setField) =>
    () => {
      setField(target.value);
    };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        filteredName={filteredName}
        onChange={inputChangeHandler}
        setValue={setFilteredName}
      />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPersonHandler}
        onChange={inputChangeHandler}
        setName={setNewName}
        setNumber={setNewNumber}
        newName={newName}
        newNumber={newNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filteredName={filteredName} />
    </div>
  );
};

export default App;
