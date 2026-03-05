import 'bootstrap/dist/css/bootstrap.min.css';
// import { Toaster } from 'react-hot-toast';
// import { LoginProvider } from '@/components/providers/LoginProvider';
// import Footer from '@/components/Footer/Footer';

import './globals.css'; // relative path to the file

// import NavbarWrapper from './../components/Navbar/NavbarWrapper';
// import NavbarClient from '@/components/Navbar/NavbarClient';
// import ExploreNearby from '@/components/Explore/ExploreNearby';
// import { LoaderProvider } from '@/components/providers/LoaderContext';
// import { RouteChangeHandler } from './Handlers/RouteChangeHandler';
// import NavbarServer from '@/components/Navbar/NavbarServer';
export const metadata = {
  title: 'Home | SyncTrip',
  description: 'Discover and join trips near you.',
};
import Script from 'next/script';
import dynamic from 'next/dynamic';
// import { LoaderProvider } from '@/components/providers/LoaderContext';
import LayoutUIController from '@/components/Layout/LayoutUIController';
import ClientProviders from '@/components/providers/ClientProviders';
import DownloadPopup from '@/components/popups/DownloadAppPopup';


const Footer = dynamic(() => import('@/components/Footer/Footer'));

// import generateSitemap from '@/temp/generateStaticSitemap';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // let user: User | null = null;

  // const cookieStore = cookies(); // Safe on server
  // const cookie = (await cookieStore).get('userInfo')?.value;

  // if (cookie) {
  //   try {
  //     user = JSON.parse(cookie);
  //   } catch {
  //     user = null;
  //   }
  // }
  // generateSitemap().catch((error) => {
  //   console.error('Failed to generate sitemap:', error);
  //   process.exit(1);
  // });
  return (
    <html lang="en">
      <body>
        <Script
          id="clarity-script"
          strategy="lazyOnload"

          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "ss9aac6yj2");`,
          }}
        />

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17836239160"
          strategy="lazyOnload"
        />

        <Script id="gtag-init" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17836239160');
          `}
        </Script>


        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <div className="App">
          {/* <LoaderProvider>
            <LoginProvider> */}
              {/* You can add a global navbar or context providers here */}
              {/* <NavbarWrapper /> */}
              {/* <RouteChangeHandler /> */}
              {/* <NavbarClient /> */}
              {/* <ExploreNearby /> */}
              {/* {<div className="announcement-bar" style={{ height: "25px", display: "none" }}>
                <div className="announcement-track">
                  <div className="announcement-content">
                    <span>SYNCTRIP APP IS LAUNCHING THIS MARCH!</span>
                  </div>
                </div>
              </div>} */}
              {/* <div style={{ height: "25px" }}></div> */}
              {/* {children} */}
              <DownloadPopup />
              <ClientProviders>
                <LayoutUIController>
                  {children}
                </LayoutUIController>
              </ClientProviders>
              {/* <Toaster position='top-right' /> */}
            {/* </LoginProvider>
          </LoaderProvider> */}
        </div>
        <Footer />
      </body>
    </html>
  );
}
