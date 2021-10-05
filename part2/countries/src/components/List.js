const List = (props) => {
  return (
    <ul>
      {props.list.map((country) => (
        <li key={country.cca3}>
          {country.name.common}&nbsp;
          <button name={country.cca3} type="button" onClick={props.onClick}>
            show
          </button>
        </li>
      ))}
    </ul>
  );
};

export default List;
