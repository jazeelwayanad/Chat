import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user || null);
  }, []);

  return { user };
};

export default useAuth;
