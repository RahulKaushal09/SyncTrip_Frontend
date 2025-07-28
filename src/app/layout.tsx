import './globals.css'; // relative path to the file
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from 'react-hot-toast';
import { LoginProvider } from '@/components/providers/LoginProvider';
import Footer from '@/components/Footer/Footer';
// import NavbarWrapper from './../components/Navbar/NavbarWrapper';
import NavbarClient from '@/components/Navbar/NavbarClient';
import { LoaderProvider } from '@/components/providers/LoaderContext';
// import { RouteChangeHandler } from './Handlers/RouteChangeHandler';
// import NavbarServer from '@/components/Navbar/NavbarServer';
export const metadata = {
  title: 'Home | SyncTrip',
  description: 'Discover and join trips near you.',
};
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <div className="App">
          <LoaderProvider>
          <LoginProvider>
            {/* You can add a global navbar or context providers here */}
            {/* <NavbarWrapper /> */}
              {/* <RouteChangeHandler /> */}
            <NavbarClient />
            {children}
            <Toaster position='top-right' />
          </LoginProvider>
          </LoaderProvider>
        </div>
        <Footer />
      </body>
    </html>
  );
}
