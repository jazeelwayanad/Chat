import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const GroupPage = () => {
  const router = useRouter();
  const { id: groupId } = router.query;
  const { user } = useAuth();
  const [userEmails, setUserEmails] = useState({}); // Add this new state
  const fetchUserEmails = async (messages) => {
    const userIds = [...new Set(messages.map(message => message.user_id))];
 
    const { data: userData, error } = await supabase
      .from('profiles')  // Assuming you have a profiles table
      .select('id, email')
      .in('id', userIds);

    if (error) {
      console.error('Error fetching user emails:', error);
      return;
    }

    const emailMap = {};
    userData.forEach(user => {
      emailMap[user.id] = user.email;
    });

    setUserEmails(emailMap);
  };
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
      fetchUserEmails(data); // Fetch emails after getting messages
    }
  };


  // Subscribe to new messages
  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`group:${groupId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, async (payload) => {
        setMessages((prev) => [...prev, payload.new]);
        // Fetch email for the new message's user if we don't have it
        if (!userEmails[payload.new.user_id]) {
          fetchUserEmails([payload.new]);
        }
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
  <div className="min-h-screen bg-[#111b21]"> {/* Dark background like Duolingo */}
    {/* Header */}
    <div className="sticky top-0 z-10 bg-[#1a272e] border-b border-[#2a373f] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">{group.name}</h1>
        <button 
          onClick={goBackToDashboard} 
          className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#58cc02] hover:bg-[#4baf01] transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Dashboard
        </button>
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      {/* Sidebar with Group Info and Members */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-[#1a272e] rounded-xl shadow-sm border border-[#2a373f] p-4 mb-4">
          <h2 className="text-lg font-semibold text-white mb-2">About</h2>
          <p className="text-gray-300 text-sm mb-3">{group.description}</p>
          <p className="text-xs text-gray-400">Created by {group.created_by}</p>
        </div>

        <div className="bg-[#1a272e] rounded-xl shadow-sm border border-[#2a373f] p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Members</h2>
          <div className="space-y-2">
            {members.length === 0 ? (
              <p className="text-sm text-gray-400">No members yet</p>
            ) : (
              members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#58cc02] flex items-center justify-center">
                    <span className="text-white font-medium">
                      {member.email?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-300">{member.email}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 bg-[#1a272e] rounded-xl shadow-sm border border-[#2a373f] flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
            {messages.map((message) => (
      <div
        key={message.id}
        className={`flex ${message.user_id === user.id ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`max-w-[70%] ${message.user_id === user.id ? 'order-2' : 'order-1'}`}>
          <div className={`rounded-xl px-4 py-2 ${
            message.user_id === user.id 
              ? 'bg-[#58cc02] text-white' 
              : 'bg-[#2a373f] text-gray-200'
          }`}>
            <p className="text-sm">{message.text}</p>
          </div>
          <div className={`mt-1 text-xs text-gray-400 ${
            message.user_id === user.id ? 'text-right' : 'text-left'
          }`}>
            <span>{message.user_id === user.id ? 'You' : userEmails[message.user_id] || 'Unknown User'}</span>
            <span className="mx-1">•</span>
            <span>{new Date(message.created_at).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-[#2a373f] p-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 rounded-xl bg-[#2a373f] text-white placeholder-gray-400 px-4 py-2 border-none focus:ring-0 transition-colors duration-200"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="inline-flex items-center px-4 py-2 rounded-xl text-white bg-[#58cc02] hover:bg-[#4baf01] transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
) : (
  <div className="min-h-screen flex items-center justify-center bg-[#111b21]">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#58cc02] border-t-transparent"></div>
  </div>
);
};

export default GroupPage;
