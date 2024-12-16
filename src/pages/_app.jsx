// import '../styles/globals.css';
// import { AuthProvider } from '../contexts/AuthContext';

// function MyApp({ Component, pageProps }) {
//   return (
//     <AuthProvider>
//       <Component {...pageProps} />
//     </AuthProvider>
//   );
// }

// export default MyApp;

import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
