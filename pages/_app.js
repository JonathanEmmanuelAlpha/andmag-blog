import Script from 'next/script'
import AuthProvider from "../context/AuthProvider";
import BlogProvider from "../context/BlogProvider";
import FAQProvider from "../context/FAQProvider";
import NotificationProvider from "../context/NotificationProvider";
import TrainProvider from "../context/TrainProvider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BlogProvider>
          <TrainProvider>
            <FAQProvider>
              <Script src="//static.surfe.pro/js/net.js"/>
              <Component {...pageProps} />
            </FAQProvider>
          </TrainProvider>
        </BlogProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default MyApp;
