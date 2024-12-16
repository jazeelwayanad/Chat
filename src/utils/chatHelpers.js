import { supabase } from './supabaseClient';

export const fetchGroups = async () => {
  const { data, error } = await supabase.from('groups').select('*');
  return data;
};

export const sendMessage = async (groupId, message) => {
  const { error } = await supabase.from('messages').insert([{ group_id: groupId, text: message }]);
  if (error) console.error('Error sending message:', error);
};
