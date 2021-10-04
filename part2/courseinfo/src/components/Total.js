const Total = ({ course }) => {
  const sum = course.parts.reduce((acc, { exercises }) => acc + exercises, 0);
  return <p>Number of exercises: {sum}</p>;
};

export default Total;
