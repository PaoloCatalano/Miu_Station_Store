import type { AppProps } from "next/app";
import { DefaultSeo } from "next-seo";
import { SWRConfig } from "swr";
import { SSRProvider } from "react-aria";
import { AppProvider } from "store/globalState";
import Layout from "components/Layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <SWRConfig
        value={{
          fetcher: (url) => fetch(url).then((r) => r.json()),
          refreshInterval: 5000,
          dedupingInterval: 5000,
        }}
      >
        <AppProvider>
          <Layout>
            <DefaultSeo
              openGraph={{
                type: "website",
                locale: "en_IE",
                siteName: process.env.WEBSITE_NAME,
                images: [
                  {
                    url: "https://miustationstore.netlify.app/images/logos/logo.png",
                    width: 1000,
                    height: 1000,
                    alt: "Miu Station",
                  },
                ],
              }}
            />
            <Component {...pageProps} />
          </Layout>
        </AppProvider>
      </SWRConfig>
    </SSRProvider>
  );
}

export default MyApp;
