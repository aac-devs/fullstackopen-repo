import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const commentHandler = (setComment, newValue) => () => {
    setComment(newValue);
  };

  const allComments = good + neutral + bad;
  let average = 0;
  let percentage = 0;
  if (allComments !== 0) {
    average = (good - bad) / allComments;
    percentage = (good * 100) / allComments;
  }

  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={commentHandler(setGood, good + 1)}>good</button>
      <button onClick={commentHandler(setNeutral, neutral + 1)}>neutral</button>
      <button onClick={commentHandler(setBad, bad + 1)}>bad</button>
      <h1>statistics</h1>
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {allComments}</p>
      <p>average {average}</p>
      <p>positive {percentage} %</p>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
