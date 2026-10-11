# Previous homepage (kept for an easy revert)

`page.tsx` here is the homepage that was live until 2026-10-12. Next.js never routes a
folder that starts with `_`, so this page is not served and cannot compete with `/` in
Google, but the code is intact.

The current homepage (`src/app/page.tsx`) was built as `/newhome`, and `/newhome` now
301-redirects to `/` (next.config.ts).

## To revert

1. `git mv src/app/page.tsx src/app/newhome/page.tsx` (or delete it), then
   `git mv src/app/_old/page.tsx src/app/page.tsx`.
2. In the moved old page, change the CSS import back to `"../../styles/home/home.css"`.
3. `src/components/Navbar/NavbarClient.tsx`: set `isHomePage` back to
   `pathname === '/' || pathname === '/blogs'` (white navbar over the dark hero).
4. `src/app/layout.tsx`: restore the preload of
   `https://synctrip.gumlet.io/compressed/Images/HomePageBg.png` (as="image", fetchPriority="high").
5. `next.config.ts`: remove the `/newhome` → `/` redirect if `/newhome` should serve the new page again.

Or simply `git revert` the commit titled "Make the new homepage live at /".
