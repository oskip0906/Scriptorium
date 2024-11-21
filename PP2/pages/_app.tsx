import "@/styles/globals.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import type { AppProps } from "next/app";
import NavBar from "@/pages/components/Navbar";
import { AppProvider } from "@/pages/components/AppVars";
import { useEffect } from "react";
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from "next/router";

import refresh from "@/lib/refresh";
export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    document.title = "Scriptorium";
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = '/logo.jpg';
    document.head.appendChild(link);
  }, []);

  const router = useRouter();

  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? "light";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    refresh();
  }, []);

  return (
    <AppProvider>
        <NavBar />
        <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={router.route}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}>
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </AppProvider>
  );
}