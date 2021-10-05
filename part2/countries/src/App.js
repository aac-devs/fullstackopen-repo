import { useEffect, useState } from 'react';
import axios from 'axios';
import Details from './components/Details';
import List from './components/List';

const BASE_URL = process.env.REACT_APP_COUNTRIES_URL;

const App = () => {
  const [countries, setCountries] = useState([]);
  const [countryToFind, setCountryToFind] = useState('');
  const [error, setError] = useState(false);
  const [countrySelected, setCountrySelected] = useState('');
  const [detailedCountry, setDetailedCountry] = useState(null);

  useEffect(() => {
    setError(false);
    setDetailedCountry(null);
    setCountries([]);
    const handler = setTimeout(() => {
      if (countryToFind.trim() !== '') {
        axios
          .get(`${BASE_URL}name/${countryToFind}`)
          .then((response) => {
            setCountries(response.data);
          })
          .catch(() => setError(true));
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [countryToFind, setCountries]);

  useEffect(() => {
    setError(false);
    if (countrySelected !== '') {
      axios
        .get(`${BASE_URL}alpha/${countrySelected}`)
        .then((response) => {
          setDetailedCountry(response.data);
        })
        .catch(() => setError(true));
    }
  }, [countrySelected]);

  const handler = (callback, event) => () => {
    callback(event);
  };

  let countriesListToShow = null;
  let countrySelectedToShow = null;

  if (error) {
    countriesListToShow = <p>Nothing found</p>;
  } else {
    if (countries.length >= 10) {
      countriesListToShow = (
        <p>Too many matches ({countries.length}), specify another filter</p>
      );
    } else if (countries.length === 0) {
      countriesListToShow = <p>Nothing to show</p>;
    } else if (countries.length === 1) {
      countrySelectedToShow = <Details details={countries[0]} />;
    } else {
      countriesListToShow = (
        <List
          list={countries}
          onClick={(e) => handler(setCountrySelected, e.target.name)()}
        />
      );
    }
  }

  if (detailedCountry) {
    countrySelectedToShow = <Details details={detailedCountry[0]} />;
  }

  return (
    <div>
      <h1>Countries</h1>
      <div>
        find countries&nbsp;
        <input
          value={countryToFind}
          onChange={(e) => handler(setCountryToFind, e.target.value)()}
        />
      </div>
      <div>{countriesListToShow}</div>
      <div>{countrySelectedToShow}</div>
    </div>
  );
};

export default App;
