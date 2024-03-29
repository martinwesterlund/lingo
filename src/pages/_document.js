import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="sv">
      <Head />
      <link rel="manifest" href="/manifest.json" />
      <link rel="apple-touch-icon" href="/logo.png"></link>
      <meta name="theme-color" content="#111827" />
      <title>Lingo</title>
      <meta property="og:title" content="Lingo" key="title" />
      <meta
        name="description"
        content="Gissa rätt ord så snabbt som möjligt!"
      />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
