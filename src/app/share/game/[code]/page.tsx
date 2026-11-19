import type { Metadata } from "next";
import { absoluteUrl } from "@/utils/og.utils";

/**
 * /share/game/:code - landing page for a shared Blind Shot game, or (code
 * "TK-XXXXX") a Tanks friend match.
 *
 * The app builds this URL (DeepLinks.game). On a phone with SyncTrip
 * installed the OS opens the app straight into the room (/share/* is in the
 * apple-app-site-association / assetlinks), so this page is for link previews,
 * desktop clicks and people who don't have the app yet.
 */

const APP_STORE = "https://apps.apple.com/in/app/synctrip-plan-meet-explore/id6761762665";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.synctrip";
const APP_STORE_ID = "6761762665";

export const revalidate = 15;

type Room = { code: string; name: string | null; status: string; round: number; players: number; maxPlayers: number; host: string | null; startsAt: number | null };
type PageProps = { params: Promise<{ code: string }> };

// The MAIN backend, without /api or /web-api. Game art (/games/blindshot/...) and
// live rooms live there. /web-api is a separate backend copy: it has neither the
// game files nor the rooms (rooms are kept in the main backend's memory).
// NEXT_PUBLIC_GAME_BASE_URL can override (e.g. https://synctrip.in).
const gameBase = () =>
  String(process.env.NEXT_PUBLIC_GAME_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "https://synctrip.in")
    .replace(/\/$/, "")
    .replace(/\/(web-)?api$/, "");
const media = (f: string) => `${gameBase()}/games/blindshot/media/${f}?v=2`;

async function getRoom(code: string): Promise<Room | null> {
  try {
    const res = await fetch(`${gameBase()}/api/games/blindshot/public/${encodeURIComponent(code.toUpperCase())}`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    const data = (await res.json()) as { room?: Room };
    return data?.room ?? null;
  } catch {
    return null; // ended / unknown code / backend briefly down - the page still sells the game
  }
}

function statusLine(r: Room | null) {
  if (!r) return "This game has ended - start your own in seconds.";
  if (r.status === "playing" || r.status === "countdown") return `Live now · round ${r.round || 1} · ${r.players} players`;
  if (r.status === "finished") return "Round over - the next game starts in a few seconds";
  return `${r.players} of ${r.maxPlayers} players in the lobby`;
}

// ── Tanks (code TK-XXXXX) ──────────────────────────────────────────────────
type TanksRoom = { code: string; status: string; players: number; maxPlayers: number; host: string | null };
const isTanks = (code: string) => /^TK-/i.test(decodeURIComponent(code));
const tanksMedia = (f: string) => `${gameBase()}/games/tanks/media/${f}?v=1`;
async function getTanksRoom(code: string): Promise<TanksRoom | null> {
  try {
    const res = await fetch(`${gameBase()}/api/games/tanks/public/${encodeURIComponent(code.toUpperCase())}`, { next: { revalidate: 15 } });
    if (!res.ok) return null;
    return ((await res.json()) as { room?: TanksRoom })?.room ?? null;
  } catch {
    return null;
  }
}

function tanksMetadata(code: string, room: TanksRoom | null): Metadata {
  const title = room?.host ? `${room.host} challenged you to Tanks on SyncTrip` : "Play Tanks on SyncTrip";
  const description = `Pick your missiles, find the angle, knock them out. A 1v1 artillery match - join with code ${code.replace(/^TK-/i, "")}.`;
  const canonical = absoluteUrl(`/share/game/${encodeURIComponent(code)}`);
  const image = tanksMedia("tanks_teaser_poster.webp");
  return {
    title, description, alternates: { canonical }, robots: { index: false, follow: true },
    openGraph: { title, description, url: canonical, siteName: "SyncTrip", locale: "en_IN", type: "website", images: [{ url: image, width: 1280, height: 720, alt: "Tanks" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    other: { "apple-itunes-app": `app-id=${APP_STORE_ID}, app-argument=${canonical}` },
  };
}

function TanksSharePage({ code, room }: { code: string; room: TanksRoom | null }) {
  const plain = code.replace(/^TK-/i, "");
  const line = !room ? "This match has started or ended - start your own in seconds."
    : room.status === "lobby" ? "Waiting for you in the lobby" : "This match has already started";
  return (
    <main className="min-h-screen bg-[#070B18] text-white flex justify-center">
      <div className="w-full max-w-md relative overflow-hidden">
        <div className="relative aspect-[4/5] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={tanksMedia("tanks_teaser_poster.webp")} alt="Tanks" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070B18]/50 via-transparent to-[#070B18]" />
          <p className="absolute top-8 left-0 right-0 text-center text-5xl font-black tracking-[0.3em]">TANKS</p>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold bg-black/55">
              <span className={`h-2 w-2 rounded-full ${room?.status === "lobby" ? "bg-emerald-400" : "bg-slate-400"}`} />
              {line}
            </span>
          </div>
        </div>
        <section className="px-6 pb-12 -mt-2 text-center">
          <p className="text-amber-300 text-xs font-black tracking-[0.25em]">YOU&apos;RE CHALLENGED</p>
          <h1 className="mt-2 text-3xl font-black leading-tight">{room?.host ? `${room.host} wants a Tanks match` : "Think you can out-aim them?"}</h1>
          <p className="mt-3 text-white/75 text-[15px] leading-relaxed">
            Pick 8 missiles, drive over the hills, set your angle and power, and knock their tank out first.
          </p>
          <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 py-4">
            <p className="text-[11px] font-black tracking-[0.2em] text-white/60">ROOM CODE</p>
            <p className="mt-1 text-4xl font-black tracking-[0.15em]">{plain}</p>
            <p className="mt-1 text-xs text-white/60">In SyncTrip: Games &gt; Tanks &gt; Join with code</p>
          </div>
          <a href={absoluteUrl(`/share/game/${encodeURIComponent(code)}`)} className="mt-6 block rounded-full bg-amber-300 text-[#1A1204] py-4 text-base font-black">Open in SyncTrip</a>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <a href={PLAY_STORE} className="rounded-full border border-white/20 bg-white/5 py-3 text-sm font-bold">Get it on Google Play</a>
            <a href={APP_STORE} className="rounded-full border border-white/20 bg-white/5 py-3 text-sm font-bold">Download on App Store</a>
          </div>
          <p className="mt-6 text-xs text-white/50">SyncTrip - meet people in your city, plan trips and play together.</p>
        </section>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  if (isTanks(code)) { const c = decodeURIComponent(code).toUpperCase(); return tanksMetadata(c, await getTanksRoom(c)); }
  const room = await getRoom(code);
  const title = room?.host ? `${room.host} invited you to Blind Shot on SyncTrip` : "Play Blind Shot on SyncTrip";
  const description = "Hide. Aim. Fire. A 10-second multiplayer laser game - last one standing wins wallet credits. Join with code " + code.toUpperCase() + ".";
  const canonical = absoluteUrl(`/share/game/${encodeURIComponent(code.toUpperCase())}`);
  const image = media("bs_teaser_poster.jpg");
  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: false, follow: true }, // short-lived rooms - not for search
    openGraph: { title, description, url: canonical, siteName: "SyncTrip", locale: "en_IN", type: "website", images: [{ url: image, width: 1280, height: 720, alt: "Blind Shot" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    other: { "apple-itunes-app": `app-id=${APP_STORE_ID}, app-argument=${canonical}` },
  };
}

export default async function GameSharePage({ params }: PageProps) {
  const { code: raw } = await params;
  const code = decodeURIComponent(raw).toUpperCase();
  if (isTanks(code)) return <TanksSharePage code={code} room={await getTanksRoom(code)} />;
  const room = await getRoom(code);
  const live = room && (room.status === "playing" || room.status === "countdown");

  return (
    <main className="min-h-screen bg-[#070B18] text-white flex justify-center">
      <div className="w-full max-w-md relative overflow-hidden">
        <div className="relative aspect-[4/5] w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("bs_hub_poster.webp")} alt="Blind Shot arena" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070B18]/60 via-transparent to-[#070B18]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media("bs_logo.webp")} alt="Blind Shot" className="absolute top-6 left-1/2 -translate-x-1/2 w-[78%]" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${live ? "bg-rose-500/90" : "bg-black/55"}`}>
              <span className={`h-2 w-2 rounded-full ${live ? "bg-white animate-pulse" : room ? "bg-emerald-400" : "bg-slate-400"}`} />
              {statusLine(room)}
            </span>
          </div>
        </div>

        <section className="px-6 pb-12 -mt-2 text-center">
          <p className="text-sky-300 text-xs font-black tracking-[0.25em]">YOU&apos;RE INVITED</p>
          <h1 className="mt-2 text-3xl font-black leading-tight">
            {room?.host ? `${room.host} wants you in this game` : "Can you be the last one standing?"}
          </h1>
          <p className="mt-3 text-white/75 text-[15px] leading-relaxed">
            Everyone hides for 10 seconds, then fires at once. Dodge the lasers, stay off the falling ring, win wallet credits.
          </p>

          <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 py-4">
            <p className="text-[11px] font-black tracking-[0.2em] text-white/60">ROOM CODE</p>
            <p className="mt-1 text-4xl font-black tracking-[0.15em]">{code}</p>
            <p className="mt-1 text-xs text-white/60">In SyncTrip: Games &gt; Blind Shot &gt; Join with code</p>
          </div>

          <a href={absoluteUrl(`/share/game/${encodeURIComponent(code)}`)} className="mt-6 block rounded-full bg-white text-[#0B1220] py-4 text-base font-black">
            Open in SyncTrip
          </a>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <a href={PLAY_STORE} className="rounded-full border border-white/20 bg-white/5 py-3 text-sm font-bold">Get it on Google Play</a>
            <a href={APP_STORE} className="rounded-full border border-white/20 bg-white/5 py-3 text-sm font-bold">Download on App Store</a>
          </div>
          <p className="mt-6 text-xs text-white/50">SyncTrip - meet people in your city, plan trips and play together.</p>
        </section>
      </div>
    </main>
  );
}
