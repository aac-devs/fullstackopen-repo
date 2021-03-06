import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import Notification from './components/Notification';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filteredName, setFilteredName] = useState('');
  const [message, setMessage] = useState(null);

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
    if (names.includes(newName.trim().toLowerCase())) {
      if (
        window.confirm(
          `${newName.trim()} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        console.log(persons);

        const personToUpdate = persons.filter(
          (person) =>
            person.name.trim().toLowerCase() === newName.trim().toLowerCase()
        )[0];
        const { id, name } = personToUpdate;
        personService
          .update(id, { name, number: newNumber })
          .then((resp) => {
            const updatedList = persons.map((person) => {
              if (person.id === id) return resp;
              return person;
            });
            setPersons(updatedList);
            setMessage({ msg: `Updated ${name}`, type: 'success' });
            setTimeout(() => setMessage(null), 3000);
          })
          .catch((err) => {
            const msg = err.response.data.error;
            if (msg.startsWith('Not Found')) {
              const updatedList = persons.filter(
                (person) => person.name !== name
              );
              setPersons(updatedList);
            }
            setMessage({ msg, type: 'error' });
            setTimeout(() => setMessage(null), 3000);
          });
        return;
      }
      return;
    } else {
      personService
        .create({ name: newName.trim(), number: newNumber })
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setMessage({ msg: `Added ${newName}`, type: 'success' });
          setTimeout(() => setMessage(null), 3000);
        });
    }

    setFilteredName('');
  };

  const handleDelete = (id) => {
    const { name } = persons.filter((person) => person.id === id)[0];
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id).then((res) => {
        const restPersons = persons.filter((person) => person.id !== id);
        setPersons(restPersons);
      });
    }
  };

  const inputChangeHandler =
    ({ target }, setField) =>
    () => {
      setField(target.value);
    };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message?.msg} error={message?.type} />
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
      <Persons
        persons={persons}
        filteredName={filteredName}
        onClick={handleDelete}
      />
    </div>
  );
};

export default App;
