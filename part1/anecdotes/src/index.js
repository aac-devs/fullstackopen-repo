import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState({});

  const buttonNextHandler = () => {
    let random = -1;
    do {
      random = Math.floor(Math.random() * props.anecdotes.length);
    } while (random === selected);
    setSelected(random);
  };

  const buttonVoteHandler = () => {
    const property = selected.toString();
    const value = votes.hasOwnProperty(selected.toString())
      ? votes[property] + 1
      : 1;
    setVotes({
      ...votes,
      [property]: value,
    });
  };

  const mostVotes = () => {
    if (Object.keys(votes).length > 0) {
      const values = Object.values(votes);
      const maximum = Math.max(...values);
      const index = values.indexOf(maximum);
      const key = Object.keys(votes)[index];
      return (
        <>
          <h1>Anecdote with most votes</h1>
          <p>{props.anecdotes[+key]}</p>
          <p>has {maximum} votes</p>
        </>
      );
    }
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {props.anecdotes[selected]}
      <p>has {!votes[selected] ? '0' : votes[selected]} votes</p>
      <button onClick={buttonVoteHandler}>vote</button>
      <button onClick={buttonNextHandler}>next anecdote</button>
      {mostVotes()}
    </div>
  );
};

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
];

ReactDOM.render(<App anecdotes={anecdotes} />, document.getElementById('root'));
