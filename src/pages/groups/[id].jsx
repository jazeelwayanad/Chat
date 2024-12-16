import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const GroupPage = () => {
  const router = useRouter();
  const { id: groupId } = router.query;
  const { user } = useAuth();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
      fetchGroupMembers();
      fetchMessages();
      subscribeToMessages();
    }
  }, [groupId]);

  // Fetch group details
  const fetchGroupDetails = async () => {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (error) {
      console.error('Error fetching group details:', error.message);
    } else {
      setGroup(data);
    }
  };

  // Fetch group members
  // Fetch group members based on the group ID
const fetchGroupMembers = async () => {
  const { data, error } = await supabase
    .from('group_members') // Assuming you have a table 'group_members' for the users in each group
    .select('user_id')
    .eq('group_id', groupId);

  if (error) {
    console.error('Error fetching group members:', error);
    return;
  }

  const members = await Promise.all(
    data.map(async (member) => {
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('id, email')
        .eq('id', member.user_id)
        .single();

      if (userError) {
        console.warn(`Error fetching user data for user_id: ${member.user_id}`, userError);
        return null; // Handle missing user data
      }

      return userData;
    })
  );

  // Filter out any `null` values
  setMembers(members.filter((member) => member !== null));
};

// Render group members with proper guarding
<ul>
  {members.length === 0 ? (
    <li>No members yet</li>
  ) : (
    members.map((member) =>
      member ? ( // Guard against `null` members
        <li key={member.id} className="my-2">
          <span>{member.email || 'Unknown Email'}</span> {/* Handle missing email */}
        </li>
      ) : null
    )
  )}
</ul>;


  // Fetch group messages
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data);
    }
  };

  // Subscribe to new messages
  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`group:${groupId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(channel);
    };
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert([{ group_id: groupId, user_id: user.id, text: newMessage.trim() }]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  // Navigate back to the dashboard
  const goBackToDashboard = () => {
    router.push('/dashboard');
  };

  return group ? (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-blue-600 text-white flex justify-between items-center">
        <h1 className="text-2xl">{group.name}</h1>
        <button onClick={goBackToDashboard} className="bg-gray-700 text-white px-4 py-2 rounded">
          Back to Dashboard
        </button>
      </div>

      {/* Group Details */}
      <div className="p-4 bg-gray-200">
        <p>{group.description}</p>
        <p className="text-sm text-gray-500">Created by: {group.created_by}</p>
      </div>

      {/* Group Members */}
      <div className="p-4 bg-gray-200">
        <h2 className="text-xl font-semibold">Group Members</h2>
        <ul>
          {members.length === 0 ? (
            <li>No members yet</li>
          ) : (
            members.map((member) => (
              <li key={member.id} className="my-2">
                <span>{member.email}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 my-2 rounded ${
                message.user_id === user.id ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {message.user_id === user.id ? 'You' : message.user_id}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(message.created_at).toLocaleString()}
                </span>
              </div>
              <p>{message.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-100 flex">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border p-2 w-3/4"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
          Send
        </button>
      </div>
    </div>
  ) : (
    <p>Loading...</p>
  );
};

export default GroupPage;
