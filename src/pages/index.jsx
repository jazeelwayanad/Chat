import Link from 'next/link';

const Index = () => {
  return (
    <div>
      <h1>Welcome to the Community Chat</h1>
      <p>Start chatting now!</p>
      <div>
        <Link href="/login">
          <button>Login</button>
        </Link>
        <Link href="/signup">
          <button>Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
