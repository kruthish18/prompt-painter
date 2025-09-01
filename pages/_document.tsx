// Custom Document for overriding <html> and <body> settings (fonts, lang, background)
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="font-sans bg-white text-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}