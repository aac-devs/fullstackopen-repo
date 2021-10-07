const Person = (props) => (
  <li>
    {props.person.name} {props.person.number}&nbsp;
    <button type="button" onClick={props.onClick}>
      delete
    </button>
  </li>
);

export default Person;
