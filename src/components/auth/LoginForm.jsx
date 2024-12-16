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
    <div className="flex min-h-screen W">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a1f2b] items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <div className="mb-8">
            <img 
              src="/logo.png" 
              alt="E-ALIM Logo" 
              className="w-24 h-24 mx-auto rounded-full bg-[#2a303c] p-4"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to <span className="text-[#22c55e]">E-ALIM</span>
          </h1>
          <p className="text-gray-400 text-lg">
            A comprehensive guide designed to support and empower new Muslims on their spiritual journey.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 bg-[#1a1f2b] flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo - Only visible on mobile */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src="/logo.png" 
              alt="E-ALIM Logo" 
              className="w-20 h-20 mx-auto rounded-full bg-[#2a303c] p-4"
            />
            <h1 className="text-3xl font-bold text-white mt-4">
              Welcome to <span className="text-[#22c55e]">E-ALIM</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Begin your spiritual journey
            </p>
          </div>

          <div className="bg-[#2a303c] rounded-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Sign in to your account
            </h2>

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-[#1a1f2b] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-600 bg-[#1a1f2b] placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-white bg-[#22c55e] hover:bg-[#16a34a] rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#22c55e] focus:ring-offset-[#2a303c]"
              >
                Sign in
              </button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-400">Don't have an account? </span>
              <a 
                href="/signup" 
                className="font-medium text-[#22c55e] hover:text-[#16a34a] transition-colors duration-200"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
