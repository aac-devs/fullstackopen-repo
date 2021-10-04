import React, { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' },
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filteredName, setFilteredName] = useState('');

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

    const newObj = {
      name: newName,
      number: newNumber,
    };
    setPersons(persons.concat(newObj));
  };

  const inputChangeHandler =
    ({ target }, setField) =>
    () => {
      setField(target.value);
    };

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with:&nbsp;
        <input
          type="text"
          value={filteredName}
          onChange={(e) => inputChangeHandler(e, setFilteredName)()}
        />
      </div>
      <h2>Add a new</h2>
      <form onSubmit={addPersonHandler}>
        <div>
          name:&nbsp;
          <input
            type="text"
            value={newName}
            onChange={(e) => inputChangeHandler(e, setNewName)()}
          />
        </div>
        <div>
          number:&nbsp;
          <input
            type="text"
            value={newNumber}
            onChange={(e) => inputChangeHandler(e, setNewNumber)()}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons
          .filter((person) => {
            if (filteredName.trim() === '') return person;
            if (
              person.name
                .toLowerCase()
                .startsWith(filteredName.trim().toLowerCase())
            ) {
              return person;
            }
            return null;
          })
          .map((person) => (
            <li key={person.name}>
              {person.name} {person.number}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default App;
