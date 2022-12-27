import "../styles/globals.css";
import { SWRConfig } from "swr";
import type { AppProps } from "next/app";
import { AppProvider } from "store/globalState";
import { SSRProvider } from "react-aria";
import Layout from "components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <SWRConfig
        value={{
          fetcher: (url) => fetch(url).then((r) => r.json()),
          refreshInterval: 5000,
          dedupingInterval: 4000,
        }}
      >
        <AppProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AppProvider>
      </SWRConfig>
    </SSRProvider>
  );
}

export default MyApp;
