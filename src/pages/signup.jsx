// import { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { useRouter } from 'next/router';

// const Signup = () => {
//   const { signUp } = useAuth();
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       await signUp(email, password);
//       router.push('/login');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <form onSubmit={handleSignup} className="p-6 bg-white rounded shadow-md">
//         <h2 className="text-2xl mb-4">Sign Up</h2>
//         {error && <p className="text-red-500">{error}</p>}
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border p-2 w-full mb-4"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="border p-2 w-full mb-4"
//         />
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signup;


import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => (
  <div className="min-h-screen flex justify-center items-center bg-gray-100">
    <SignupForm />
  </div>
);

export default SignupPage;
