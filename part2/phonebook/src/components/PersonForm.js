const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name:&nbsp;
        <input
          type="text"
          value={props.newName}
          onChange={(e) => props.onChange(e, props.setName)()}
        />
      </div>
      <div>
        number:&nbsp;
        <input
          type="text"
          value={props.newNumber}
          onChange={(e) => props.onChange(e, props.setNumber)()}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
