import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Statistic = ({ text, value }) => (
  <p>
    {text} {value} {text === 'positive' ? '%' : ''}
  </p>
);

const Statistics = ({ good, neutral, bad }) => {
  const allComments = good + neutral + bad;

  if (allComments === 0) return <p>No feedback given</p>;

  const average = (good - bad) / allComments;
  const percentage = (good * 100) / allComments;

  return (
    <>
      <h1>statistics</h1>
      <Statistic text="good" value={good} />
      <Statistic text="neutral" value={neutral} />
      <Statistic text="bad" value={bad} />
      <Statistic text="all" value={allComments} />
      <Statistic text="average" value={average} />
      <Statistic text="positive" value={percentage} />
    </>
  );
};

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const commentHandler = (setComment, newValue) => () => {
    setComment(newValue);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={commentHandler(setGood, good + 1)} text="good" />
      <Button
        handleClick={commentHandler(setNeutral, neutral + 1)}
        text="neutral"
      />
      <Button handleClick={commentHandler(setBad, bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
