import { setAutoFreeze } from "immer";
import { AppProps } from "next/app";
import React from "react";
import "tailwindcss/tailwind.css";

setAutoFreeze(false);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.StrictMode>
      <Component {...pageProps} />
    </React.StrictMode>
  );
}

export default MyApp;
