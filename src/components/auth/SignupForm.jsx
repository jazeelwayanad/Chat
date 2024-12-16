import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push('/login');
    } catch (error) {
      console.error('Error signing up:', error.message);
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#1a1f2b] overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#2a2f3b] flex items-center justify-center mb-4">
            <img
                src="/avatar-icon.svg"
              alt="Avatar"
              className="w-16 h-16"
            />
          </div>
          <h2 className="text-3xl font-bold text-white">
            Welcome to <span className="text-[#22c55e]">E-ALIM</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            A comprehensive guide designed to support and empower new Muslims on their spiritual journey.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-[#2a2f3b] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent sm:text-sm"
              />
            </div>
            <div>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-[#2a2f3b] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-400/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-lg text-white bg-[#22c55e] hover:bg-[#1ea54d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22c55e] transition-all duration-200"
            >
              Get Started
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default SignupForm;
