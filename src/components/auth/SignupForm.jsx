// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { supabase } from '../../utils/supabaseClient';

// const SignupForm = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     const { error } = await supabase.auth.signUp({ email, password });
//     if (error) setError(error.message);
//     else router.push('/dashboard');
//   };

//   return (
//     <form onSubmit={handleSignup} className="max-w-md mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-4">Signup</h1>
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
//       <button type="submit" className="bg-green-500 text-white py-2 px-4 w-full">
//         Signup
//       </button>
//     </form>
//   );
// };

// export default SignupForm;

// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { auth } from '../../utils/supabaseClient';

// const SignupForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       router.push('/dashboard');
//     } catch (error) {
//       console.error(error.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSignup}>
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
//       <button type="submit">Sign Up</button>
//     </form>
//   );
// };

// export default SignupForm;


// import { useState } from 'react';
// import { supabase } from '../../utils/supabaseClient';
// import { useRouter } from 'next/router';

// const SignupForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const router = useRouter();

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//       });

//       if (error) throw error;

//       // Redirect to the login page after successful signup
//       router.push('/login');
//     } catch (error) {
//       console.error('Signup error:', error.message);
//     }
//   };

//   return (
//     <form onSubmit={handleSignup}>
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
//       <button type="submit">Sign Up</button>
//     </form>
//   );
// };

// export default SignupForm;

import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient'; // Make sure this is correctly imported

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error
    setError('');

    try {
      // Call the Supabase signUp function
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Redirect to login page or dashboard
      router.push('/login'); // Redirect to login after successful signup
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError(error.message); // Show error message if signup fails
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
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
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error */}
    </div>
  );
};



export default SignupForm;
