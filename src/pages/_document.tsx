import Document, {
  Html, Head, Main, NextScript,
  DocumentContext, DocumentInitialProps,
} from 'next/document';

const GTM_ID = 'GTM-MZZSQJ6N';

interface ExtendedDocumentProps extends DocumentInitialProps {
  nonce?: string;
}

class MyDocument extends Document<ExtendedDocumentProps> {
  static async getInitialProps(ctx: DocumentContext): Promise<ExtendedDocumentProps> {
    const initialProps = await Document.getInitialProps(ctx);

    let nonce: string | undefined;
    const cspHeader = ctx.res?.getHeader('Content-Security-Policy');
    if (typeof cspHeader === 'string') {
      const match = cspHeader.match(/'nonce-([^']+)'/);
      nonce = match?.[1];
    }

    return { ...initialProps, nonce };
  }

  render() {
    const { nonce } = this.props;

    return (
      <Html lang="en">
        <Head nonce={nonce}>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap"
            rel="stylesheet"
          />

          {/* Google Tag Manager */}
          <script
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                  var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true;
                  j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                  f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        </Head>
        <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            className="noscriptFrame"
          />
        </noscript>

        <Main />
        <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;