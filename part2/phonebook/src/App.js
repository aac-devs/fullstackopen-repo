import React, { useState } from 'react';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');

  const addPersonHandler = (event) => {
    event.preventDefault();
    const newObj = {
      name: newName,
    };
    setPersons(persons.concat(newObj));
    setNewName('');
  };

  const changePersonHandler = (event) => {
    setNewName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addPersonHandler}>
        <div>
          name: <input value={newName} onChange={changePersonHandler} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
