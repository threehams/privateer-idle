import { Html, Head, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="text-gray-300 bg-gray-900 font-monospace">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
