import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document<{ nonce?: string }> {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);

    const nonce = ctx.req?.headers['x-nonce'];

    return {
      ...initialProps,
      nonce,
    };
  }

  render() {
    const nonce = (this.props as any).nonce;

    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
        <Main />
        <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;