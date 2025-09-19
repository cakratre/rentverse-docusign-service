import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Rental Agreement PDF Generator</title>
        <link rel="icon" href="/favicon/icon.svg" type="image/svg+xml" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default App;
