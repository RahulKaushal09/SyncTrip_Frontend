import './globals.css'; // relative path to the file
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toaster } from 'react-hot-toast';

// import '../styles/globals.css'; // your own styles
// 
// eslint-disable-next-line react/no-unescaped-entities

import { LoginProvider } from '@/components/providers/LoginProvider';

import Navbar from '@/components/Navbar/NavbarNew';
export const metadata = {
  title: 'Home | SyncTrip',
  description: 'Discover and join trips near you.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="App">
          <LoginProvider>
            {/* You can add a global navbar or context providers here */}
            <Navbar></Navbar>
            {children}
            <Toaster position='top-right' />
          </LoginProvider>
        </div>
      </body>
    </html>
  );
}
