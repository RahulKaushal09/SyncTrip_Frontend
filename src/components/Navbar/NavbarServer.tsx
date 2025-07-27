// // components/Navbar/NavbarServer.tsx
// import { cookies } from 'next/headers';
// import { User } from '@/types';
// import NavbarClient from './NavbarClient';

// export default async function NavbarServer() {
//     console.time('NavbarServer');
//     let user: User | null = null;
//     const cookieStore = cookies();
//     console.time('GetCookie');
//     const cookie = (await cookieStore).get('userInfo')?.value;
//     console.timeEnd('GetCookie');

//     if (cookie) {
//         console.time('ParseCookie');
//         try {
//             user = JSON.parse(cookie);
//         } catch {
//             user = null;
//         }
//         console.timeEnd('ParseCookie');
//     }

//     console.timeEnd('NavbarServer');
//     return <NavbarClient user={user} />;
// }