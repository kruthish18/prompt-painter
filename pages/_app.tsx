// // import "@/styles/globals.css";
// import type { AppProps } from "next/app";
// import '../styles/globals.css';

// export default function App({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />;
// }



// app/layout.tsx
import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
