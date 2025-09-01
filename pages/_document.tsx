// // pages/_document.tsx
// import { Html, Head, Main, NextScript } from 'next/document'

// export default function Document() {
//   return (
//     <Html lang="en">
//       <Head>
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
//           rel="stylesheet"
//         />
//       </Head>
//       <body className="font-sans">
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }
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