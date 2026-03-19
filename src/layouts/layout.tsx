// Vite/React: do NOT use <html> or <body> — they already exist in index.html.
// This layout only wraps app content + TawkToChat.

// import TawkToChat from "@/components/TawkToChat";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* <TawkToChat /> */}
    </>
  );
}


// ─────────────────────────────────────────────────────────────────
// If you use Pages Router (pages/_app.js), use this instead:
//
// import TawkToChat from "@/components/TawkToChat";
//
// export default function App({ Component, pageProps }) {
//   return (
//     <>
//       <Component {...pageProps} />
//       <TawkToChat />
//     </>
//   );
// }
// ─────────────────────────────────────────────────────────────────
