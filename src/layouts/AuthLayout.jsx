const AuthLayout = ({ children }) => {
    return (
      <div>
        <header>Authentication Header</header>
        <main>{children}</main>
      </div>
    );
  };
  
  export default AuthLayout;
  