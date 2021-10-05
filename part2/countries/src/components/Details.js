import { useEffect, useState } from 'react';
const axios = require('axios');

const BASE_URL = process.env.REACT_APP_WEATHER_URL;
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const Details = (props) => {
  const [weather, setWeather] = useState(null);

  const {
    name: { common: name },
    capital,
    population,
    languages,
    flags: { png: flag },
  } = props.details;
  const cap = capital?.length > 0 ? capital[0] : 'not specified';

  useEffect(() => {
    const handler = setTimeout(() => {
      axios
        .get(`${BASE_URL}current?access_key=${API_KEY}&query=${cap}`)
        .then((response) => {
          const apiResponse = response.data;
          setWeather(apiResponse);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [cap]);

  let weatherToShow = null;
  if (weather) {
    const { current, location } = weather;
    const { temperature, wind_dir, wind_speed, weather_icons } = current;
    weatherToShow = (
      <div>
        <h3>Weather in {location.name}</h3>
        <p>
          <strong>temperature</strong> {temperature} Celsius
        </p>
        <img src={weather_icons[0]} alt="weather" />;
        <p>
          <strong>wind</strong> {wind_speed} mph&nbsp;
          <strong>direction</strong>&nbsp;
          {wind_dir}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>{name}</h2>
      <p>capital {cap}</p>
      <p>population {population ? population : 'not specified'}</p>
      <h3>Spoken languages</h3>
      <ul>
        {Object.values(languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={flag} alt="flag" style={{ width: '100px' }} />
      {weatherToShow}
    </div>
  );
};

export default Details;
