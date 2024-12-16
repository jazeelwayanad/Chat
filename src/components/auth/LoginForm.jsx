// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from '../../utils/supabaseClient';

// const LoginForm = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) setError(error.message);
//     else router.push('/dashboard');
//   };

//   return (
//     <form onSubmit={handleLogin} className="max-w-md mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-4">Login</h1>
//       {error && <p className="text-red-500">{error}</p>}
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         className="border p-2 w-full mb-4"
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="border p-2 w-full mb-4"
//         required
//       />
//       <button type="submit" className="bg-blue-500 text-white py-2 px-4 w-full">
//         Login
//       </button>
//     </form>
//   );
// };

// // export default LoginForm;
// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from '../../utils/supabaseClient';  // Ensure this import is correct

// const LoginForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const { user, error } = await supabase.auth.signInWithPassword({
//         email,
//         password,
//       });

//       if (error) throw error;
//       router.push('/dashboard'); // Redirect to dashboard after login
//     } catch (error) {
//       console.error('Login error:', error.message);
//     }
//   };

//   return (
//     <form onSubmit={handleLogin}>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         required
//       />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default LoginForm;


import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect to the dashboard after successful login
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
