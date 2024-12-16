// const ChatBox = ({ messages, onSendMessage }) => {
//     return (
//       <div className="flex flex-col h-full">
//         <div className="flex-1 overflow-y-auto p-4">
//           {messages.map((msg, idx) => (
//             <div key={idx} className="my-2">
//               <span className="font-bold">{msg.username}</span>: {msg.text}
//             </div>
//           ))}
//         </div>
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             const input = e.target.elements.message;
//             onSendMessage(input.value);
//             input.value = '';
//           }}
//           className="flex"
//         >
//           <input
//             name="message"
//             type="text"
//             placeholder="Type a message..."
//             className="border flex-grow p-2"
//           />
//           <button type="submit" className="bg-blue-500 text-white px-4 py-2">
//             Send
//           </button>
//         </form>
//       </div>
//     );
//   };
  
//   export default ChatBox;
import { useState } from 'react';
import { sendMessage } from '../../utils/chatHelpers';

const ChatBox = ({ groupId }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    sendMessage(groupId, message);
    setMessage('');
  };

  return (
    <div>
      <div className="messages">
        {/* Render messages dynamically here */}
      </div>
      <form onSubmit={handleSendMessage}>
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBox;


  