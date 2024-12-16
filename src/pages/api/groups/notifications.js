export default async function handler(req, res) {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { userId } = req.query;
  
    if (!userId) {
      return res.status(400).json({ message: 'Missing userId' });
    }
  
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId);
  
    if (error) {
      console.error('Error fetching notifications:', error.message);
      return res.status(500).json({ message: error.message });
    }
  
    res.status(200).json(data);
  }
  