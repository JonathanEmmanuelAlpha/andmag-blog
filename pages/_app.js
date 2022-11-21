import AuthProvider from "../context/AuthProvider";
import BlogProvider from "../context/BlogProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <BlogProvider>
        <Component {...pageProps} />
      </BlogProvider>
    </AuthProvider>
  );
}

export default MyApp;
