import { supabase } from '../../../utils/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { groupId, userId } = req.body;

    const { data, error } = await supabase
      .from('group_members')
      .insert([{ group_id: groupId, user_id: userId }]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } else {
    res.status(405).send({ message: 'Only POST requests allowed' });
  }
}
