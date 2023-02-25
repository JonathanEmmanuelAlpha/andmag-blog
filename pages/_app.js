import AuthProvider from "../context/AuthProvider";
import BlogProvider from "../context/BlogProvider";
import FAQProvider from "../context/FAQProvider";
import TrainProvider from "../context/TrainProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <BlogProvider>
        <TrainProvider>
          <FAQProvider>
            <Component {...pageProps} />
          </FAQProvider>
        </TrainProvider>
      </BlogProvider>
    </AuthProvider>
  );
}

export default MyApp;
