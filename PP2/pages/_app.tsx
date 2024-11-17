import "@/styles/globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import type { AppProps } from "next/app";
import { AppProvider } from "@/pages/components/AppVars";
import { useEffect } from "react";
import refresh from "@/lib/refresh";
export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? "light";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    refresh();
  }, []);

  return (
    <AppProvider>
        <Component {...pageProps} />
    </AppProvider>
  );
}
