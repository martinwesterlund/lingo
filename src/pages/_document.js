import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="sv">
      <Head />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/512.png"></link>
      <link rel="icon" href="/512.png" />
      <meta name="theme-color" content="#212121" />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
