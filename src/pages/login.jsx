// import { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { useRouter } from 'next/router';

// const Login = () => {
//   const { signIn } = useAuth();
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       await signIn(email, password);
//       router.push('/dashboard'); // Redirect to dashboard after successful login
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow-md w-96">
//         <h2 className="text-2xl font-bold mb-4">Log In</h2>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
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
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
//           Log In
//         </button>
//         <p className="mt-4 text-sm text-gray-600">
//           Don't have an account? <a href="/signup" className="text-blue-500">Sign up here</a>.
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;

import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => (
  <div className="min-h-screen flex justify-center items-center bg-gray-100">
    <LoginForm />
  </div>
);

export default LoginPage;
