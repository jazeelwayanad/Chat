// import { createContext, useContext, useState, useEffect } from 'react';
// import { supabase } from '../utils/supabaseClient';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const session = supabase.auth.session();
//     setUser(session?.user || null);

//     const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
//       setUser(session?.user || null);
//     });

//     return () => listener.unsubscribe();
//   }, []);

//   const signUp = async (email, password) => {
//     const { error } = await supabase.auth.signUp({ email, password });
//     if (error) throw error;
//   };

//   const signIn = async (email, password) => {
//     const { error } = await supabase.auth.signIn({ email, password });
//     if (error) throw error;
//   };

//   const signOut = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) throw error;
//   };

//   return (
//     <AuthContext.Provider value={{ user, signUp, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// import { createContext, useContext, useState } from 'react';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// import { createContext, useContext, useState, useEffect } from 'react';
// import { supabase } from '../utils/supabaseClient';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Use the updated method for fetching the current session
//     const fetchSession = async () => {
//       const { data: session } = await supabase.auth.getSession(); // Updated method
//       setUser(session?.user || null);
//     };

//     fetchSession();

//     // Listen for changes in auth state
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         setUser(session?.user || null);
//       }
//     );

//     return () => {
//       authListener?.unsubscribe();
//     };
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: session } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);  // Clear user state after signing out
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
