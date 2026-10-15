import React from "react";
import Link from "next/link";
import { Clock, Trophy, Users } from "lucide-react";
import type { Game } from "@/data/games";
import { GAMES } from "@/data/games";
import { CITY_GUIDES } from "@/data/cityGuides";
import type { GuideFeed } from "@/lib/cityGuideApi";
import { AppCtaBand, GuideFaqList, GuideHero, HappeningRail } from "@/components/CityGuide/parts";
import styles from "@/components/CityGuide/CityGuide.module.css";
import gs from "./Games.module.css";

/** One game: what it is, sides, how a round works, how to win, tips, live game nights, FAQ. */
export function GameView({ game, feed }: { game: Game; feed: GuideFeed }) {
  const track = { campaign: "games", term: game.slug };
  const related = game.related.map((s) => GAMES.find((g) => g.slug === s)).filter((g): g is Game => !!g);

  return (
    <div className={styles.page} style={{ ["--accent" as string]: "#7C3AED" } as React.CSSProperties}>
      <GuideHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Games", href: "/games" }, { label: game.name }]}
        kicker={`Social deduction · ${game.players}`}
        title={game.h1}
        intro={game.intro}
        image={game.boxArt ? undefined : game.image}
        sideImage={game.boxArt && { ...game.boxArt, variant: "product" }}
        tone={game.image && !game.boxArt ? undefined : "brand"}
        stats={[
          { icon: <Users size={15} aria-hidden />, label: game.players },
          { icon: <Clock size={15} aria-hidden />, label: game.time },
        ]}
      />

      <div className={styles.body}>
        <section className={styles.section} aria-labelledby="sides-title">
          <div className={styles.sectionHead}>
            <div>
              <h2 id="sides-title" className={styles.h2}>Teams and roles in {game.name}</h2>
              <p className={styles.sub}>{game.tagline}</p>
            </div>
          </div>
          <div className={`${styles.tipGrid} ${gs.grid}`}>
            {game.sides.map((s) => (
              <div key={s.name} className={`${styles.tip} ${gs.card}`}>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="how-title">
          <div className={styles.sectionHead}>
            <h2 id="how-title" className={styles.h2}>How to play {game.name}</h2>
          </div>
          <div className={`${styles.tipGrid} ${gs.grid}`}>
            {game.howToPlay.map((step, i) => (
              <div key={i} className={`${styles.tip} ${gs.card} ${gs.step}`}>
                <span className={styles.tipNum}>{i + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="win-title">
          <div className={styles.venuePanel}>
            <h2 id="win-title">How to win</h2>
            <ul className={styles.factList}>
              {game.winning.map((w) => (
                <li key={w}><Trophy size={18} aria-hidden /><span>{w}</span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="tips-title">
          <div className={styles.sectionHead}>
            <h2 id="tips-title" className={styles.h2}>Tips for your first game</h2>
          </div>
          <div className={`${styles.tipGrid} ${gs.grid}`}>
            {game.tips.map((t, i) => (
              <div key={i} className={`${styles.tip} ${gs.card} ${gs.step}`}>
                <span className={styles.tipNum}>{i + 1}</span>
                <p>{t}</p>
              </div>
            ))}
          </div>
        </section>

        <HappeningRail
          track={track}
          feed={feed}
          cityName="your city"
          title={`Play ${game.name} with people near you`}
          sub="Upcoming SyncTrip board-game and social deduction nights. Most people come alone."
          emptyTitle="No game nights posted this week"
        />

        <section className={styles.section} aria-labelledby="cities-title">
          <div className={styles.sectionHead}>
            <h2 id="cities-title" className={styles.h2}>Game cafés and game nights by city</h2>
          </div>
          <div className={`${styles.relatedRow} ${gs.chips}`}>
            {CITY_GUIDES.map((c) => (
              <Link key={c.citySlug} href={`/city/${c.citySlug}/gaming-board-games`} className={styles.relatedLink}>
                Board games in {c.cityName}
              </Link>
            ))}
          </div>
        </section>

        <GuideFaqList faqs={game.faqs} title={`${game.name}: questions people ask`} />

        {related.length > 0 && (
          <section className={styles.section} aria-labelledby="more-title">
            <div className={styles.sectionHead}>
              <div>
                <h2 id="more-title" className={styles.h2}>If you like {game.name}, try</h2>
              </div>
              <Link href="/games" className={styles.btnOutline}>All games</Link>
            </div>
            <div className={gs.gameGrid}>
              {related.map((g) => (
                <GameCard key={g.slug} game={g} />
              ))}
            </div>
          </section>
        )}

        <AppCtaBand cityName="your city" track={track} />
      </div>
    </div>
  );
}

/** A game with its box art, players and time; used on the hub and in "try next". */
function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.slug}`} className={`${styles.linkCard} ${gs.gameCard}`}>
      {game.boxArt && (
        // Static, pre-compressed box art.
        // eslint-disable-next-line @next/next/no-img-element
        <img className={gs.gameThumb} src={game.boxArt.src} alt={game.boxArt.alt} loading="lazy" width={72} height={90} />
      )}
      <span className={gs.gameText}>
        <span className={gs.gameName}>{game.name}</span>
        <span className={styles.linkDist}>{game.players} · {game.time}</span>
        <span className={styles.linkNote}>{game.tagline}</span>
      </span>
    </Link>
  );
}

/** /games: every game, plus live game nights. */
export function GamesHubView({ feed }: { feed: GuideFeed }) {
  const track = { campaign: "games", term: "hub" };
  return (
    <div className={styles.page} style={{ ["--accent" as string]: "#7C3AED" } as React.CSSProperties}>
      <GuideHero
        crumbs={[{ label: "Home", href: "/" }, { label: "Games" }]}
        kicker="Game nights · Social deduction & party games"
        title="Social deduction and party games to play with friends"
        intro={[
          "Mafia, Werewolf, Secret Hitler, Blood on the Clocktower: the best games for a group are the ones where someone at the table is lying. Below are simple rules for each, so you can teach them in five minutes.",
          "No group to play with? SyncTrip game nights put you at a table with people near you who love the same games. Most people come alone.",
        ]}
        image={{ src: "/home/games-hero-secret-hitler.jpg", alt: "A SyncTrip game night: ten new friends playing Secret Hitler at a café" }}
      />
      <div className={styles.body}>
        <section className={styles.section} aria-labelledby="games-title">
          <div className={styles.sectionHead}>
            <div>
              <h2 id="games-title" className={styles.h2}>Rules for the best party games</h2>
              <p className={styles.sub}>Pick a game to learn how it works, how to win, and where to play it.</p>
            </div>
          </div>
          <div className={gs.gameGrid}>
            {GAMES.map((g) => (
              <GameCard key={g.slug} game={g} />
            ))}
          </div>
        </section>

        <HappeningRail
          track={track}
          feed={feed}
          cityName="your city"
          title="Game nights coming up on SyncTrip"
          sub="Board-game and social deduction nights hosted by SyncTrip clubs. Join one, or post your own."
          emptyTitle="No game nights posted this week"
        />

        <section className={styles.section} aria-labelledby="cities-title">
          <div className={styles.sectionHead}>
            <h2 id="cities-title" className={styles.h2}>Board-game cafés by city</h2>
          </div>
          <div className={`${styles.relatedRow} ${gs.chips}`}>
            {CITY_GUIDES.map((c) => (
              <Link key={c.citySlug} href={`/city/${c.citySlug}/gaming-board-games`} className={styles.relatedLink}>
                Board games in {c.cityName}
              </Link>
            ))}
          </div>
        </section>

        <GuideFaqList
          title="Game night questions"
          faqs={GAMES_HUB_FAQS}
        />
        <AppCtaBand cityName="your city" track={track} />
      </div>
    </div>
  );
}

export const GAMES_HUB_FAQS = [
  { question: "What are social deduction games?", answer: "Games where players have hidden roles and some of them are lying. The rest of the table has to work out who to trust through discussion and votes. Mafia, Werewolf, Secret Hitler, Avalon and Blood on the Clocktower are the best-known." },
  { question: "What are the best party games for adults?", answer: "For big groups: Mafia, Werewolf and Blood on the Clocktower. For 5–10 players: Secret Hitler and Avalon. For quick rounds: Spyfall and Coup." },
  { question: "Which game is best for beginners?", answer: "Mafia or Werewolf. They need no materials beyond a deck of cards, and the rules take two minutes to explain." },
  { question: "Where can I find people to play board games with?", answer: "Join a SyncTrip game night, or post your own and let people nearby join. Hosts run social deduction and board-game nights at cafés, and most people come alone." },
];
