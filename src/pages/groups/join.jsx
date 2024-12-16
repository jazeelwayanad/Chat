import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { groupId, userId, email } = req.body; // Make sure you pass email to the request

    // Insert into group_members table
    const { data, error } = await supabase
      .from('group_members')
      .insert([{ group_id: groupId, user_id: userId }]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Update group created_by field to store the email
    const { error: updateError } = await supabase
      .from('groups')
      .update({ created_by: email })
      .eq('id', groupId);

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    res.status(201).json(data);
  } else {
    res.status(405).send({ message: 'Only POST requests allowed' });
  }
}
