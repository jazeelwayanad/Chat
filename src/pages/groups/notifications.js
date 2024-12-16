import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req, res) {
  const { userId, groupId } = req.query;

  // Fetch the user's last read time for the group
  const { data: memberData, error: memberError } = await supabase
    .from('group_members')
    .select('last_read')
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .single();

  if (memberError) return res.status(400).json({ error: memberError.message });

  // Fetch unread messages
  const { data: unreadMessages, error: messageError } = await supabase
    .from('messages')
    .select('*')
    .eq('group_id', groupId)
    .gt('created_at', memberData.last_read || '1970-01-01T00:00:00.000Z');

  if (messageError) return res.status(400).json({ error: messageError.message });

  res.status(200).json(unreadMessages);
}
