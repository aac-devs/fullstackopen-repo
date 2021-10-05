import Person from './Person';

const Persons = (props) => {
  return (
    <ul>
      {props.persons
        .filter((person) => {
          if (props.filteredName.trim() === '') return person;
          if (
            person.name
              .toLowerCase()
              .startsWith(props.filteredName.trim().toLowerCase())
          ) {
            return person;
          }
          return null;
        })
        .map((person) => (
          <Person
            key={person.name}
            person={person}
            onClick={() => props.onClick(person.id)}
          />
        ))}
    </ul>
  );
};

export default Persons;
