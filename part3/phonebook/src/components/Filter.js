const Filter = (props) => {
  return (
    <div>
      filter shown with:&nbsp;
      <input
        type="text"
        value={props.filteredName}
        onChange={(e) => props.onChange(e, props.setValue)()}
      />
    </div>
  );
};

export default Filter;
