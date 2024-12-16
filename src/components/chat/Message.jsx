const Message = ({ message }) => {
    return (
      <div className="message">
        <span>{message.user}</span>: {message.text}
      </div>
    );
  };
  
  export default Message;
  