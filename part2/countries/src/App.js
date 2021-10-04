import { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [countryToFind, setCountryToFind] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    const handler = setTimeout(() => {
      if (countryToFind.trim() !== '') {
        axios
          .get(`https://restcountries.com/v3.1/name/${countryToFind}`)
          .then((response) => {
            setCountries(response.data);
          })
          .catch(() => setError(true));
      } else {
        setCountries([]);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [countryToFind, setCountries]);

  const searchHandler = (event) => {
    setCountryToFind(event.target.value);
  };

  let countriesToShow = null;
  if (error) {
    countriesToShow = <p>Nothing found</p>;
  } else {
    if (countries.length >= 10) {
      countriesToShow = (
        <p>Too many matches ({countries.length}), specify another filter</p>
      );
    } else if (countries.length === 0) {
      countriesToShow = <p>Nothing to show</p>;
    } else if (countries.length === 1) {
      const {
        name: { common: name },
        capital,
        population,
        languages,
        flags: { png: flag },
      } = countries[0];
      countriesToShow = (
        <div>
          <h2>{name}</h2>
          <p>capital {capital}</p>
          <p>population {population}</p>
          <h3>languages</h3>
          <ul>
            {Object.values(languages).map((lang) => (
              <li key={lang}>{lang}</li>
            ))}
          </ul>
          <img src={flag} alt="flag" />
        </div>
      );
    } else {
      countriesToShow = countries.map((country) => (
        <li key={country.cca3}>{country.name.common}</li>
      ));
    }
  }

  return (
    <div>
      <h1>Countries</h1>
      <div>
        find countries <input value={countryToFind} onChange={searchHandler} />
      </div>
      <div>{countriesToShow}</div>
    </div>
  );
};

export default App;
