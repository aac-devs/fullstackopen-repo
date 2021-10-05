const Details = (props) => {
  const {
    name: { common: name },
    capital,
    population,
    languages,
    flags: { png: flag },
  } = props.details;
  console.log(props.details);

  return (
    <div>
      <h2>{name}</h2>
      <p>capital {capital?.length > 0 ? capital[0] : 'not specified'}</p>
      <p>population {population ? population : 'not specified'}</p>
      <h3>languages</h3>
      <ul>
        {Object.values(languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={flag} alt="flag" />
    </div>
  );
};

export default Details;
