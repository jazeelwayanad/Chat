// import { supabase } from '../../../utils/supabaseClient';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     const { name, description, userId } = req.body;

//     const { data, error } = await supabase
//       .from('groups')
//       .insert([{ name, description, owner_id: userId }]);

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.status(201).json(data);
//   } else {
//     res.status(405).send({ message: 'Only POST requests allowed' });
//   }
// }


const createGroup = async () => {
  // Check if user is authenticated
  if (!user) {
    console.error("User is not authenticated.");
    return; // Exit early if user is null
  }

  const { name, description } = newGroup;
  const { error } = await supabase
    .from('groups')
    .insert([{ name, description, owner_id: user.id }]);

  if (error) {
    console.error(error);
  } else {
    setNewGroup({ name: '', description: '' });
    fetchGroups();
  }
};

