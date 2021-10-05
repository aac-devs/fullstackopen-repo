const Notification = ({ message, error }) => {
  if (message === undefined) {
    return null;
  }
  return (
    <div className={error === 'error' ? 'error' : 'success'}>{message}</div>
  );
};

export default Notification;
