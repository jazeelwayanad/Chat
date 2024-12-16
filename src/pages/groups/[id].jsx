import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const GroupChat = () => {
  const router = useRouter();
  const { id: groupId } = router.query;
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (groupId) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [groupId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*, user_id, created_at')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data);
    }
  };

  // This will subscribe to new messages in the group in real time
  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`group:${groupId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        console.log('New message received:', payload.new);
        setMessages((prev) => [...prev, payload.new]); // Add the new message to state
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from('messages').insert([
      {
        group_id: groupId,
        user_id: user.id,
        text: newMessage.trim(),
      },
    ]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="p-4 bg-blue-600 text-white">
        <h1 className="text-2xl">Group Chat</h1>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 my-2 rounded ${message.user_id === user.id ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{message.user_id === user.id ? 'You' : message.user_id}</span>
                <span className="text-xs text-gray-400">{new Date(message.created_at).toLocaleString()}</span>
              </div>
              <p>{message.text}</p>
            </div>
          ))
        )}
      </div>
      <div className="p-4 bg-white flex">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-2 w-3/4"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 ml-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
