import Content from './Content';
import Header from './Header';
import Total from './Total';

const Course = (props) => (
  <>
    <Header course={props.course} />
    <Content course={props.course} />
    <Total course={props.course} />
  </>
);

export default Course;
