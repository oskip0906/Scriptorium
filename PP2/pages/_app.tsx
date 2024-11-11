import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AppProvider } from "@/pages/components/AppVars";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? "light";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);

  }, []);

  return (
    <AppProvider>
        <Component {...pageProps} />
    </AppProvider>
  );
}
