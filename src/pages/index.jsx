import Link from 'next/link';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#1a1f24] text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Welcome to <span className="text-[#23C55E]">E-ALIM</span>
            </h1>
            <p className="text-xl text-gray-300">
              Connect with people around the world. Share ideas, collaborate, and build meaningful relationships in our vibrant community.
            </p>
            <div className="flex gap-4">
              <Link href="/login">
                <button className="bg-[#23C55E] hover:bg-[#1ea34d] text-white font-bold py-3 px-8 rounded-lg transition duration-300">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="border border-[#23C55E] text-[#23C55E] hover:bg-[#23C55E] hover:text-white font-bold py-3 px-8 rounded-lg transition duration-300">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="w-full h-[400px] rounded-xl bg-[#242a31] border border-[#2f363d] flex items-center justify-center">
              <div className="w-60 h-60 overflow-hidden">
                <img 
                  src="/avatar.png" 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
