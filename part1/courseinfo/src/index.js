import React from 'react';
import ReactDOM from 'react-dom';
import Content from './Content';
import Header from './Header';
import Total from './Total';

const App = () => {
  const course = 'Half Stack application development';
  const part1 = 'Fundamentals of React';
  const exercises1 = 10;
  const part2 = 'Using props to pass data';
  const exercises2 = 7;
  const part3 = 'State of a component';
  const exercises3 = 14;

  return (
    <div>
      <Header title={course} />
      <Content
        p1={part1}
        e1={exercises1}
        p2={part2}
        e2={exercises2}
        p3={part3}
        e3={exercises3}
      />
      <Total total={exercises1 + exercises2 + exercises3} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
