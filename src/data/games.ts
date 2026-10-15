/**
 * Social deduction & party games: /games (hub) and /games/<slug>.
 *
 * Keyword Planner (India, Oct 2026): mafia game 18.1k (rules 2.9k, party/card game 2.4k each,
 * how to play mafia 1.6k), secret hitler 5.4k + game 2.9k, werewolf game 3.6k, spyfall 2.9k,
 * coup card game 2.4k, blood on the clocktower 1.6k, avalon 590; hub: party games 18.1k,
 * games to play with friends 14.8k, game night 12.1k, social deduction party games 2.9k.
 * Rules are summarised in our own words (never copied from a rulebook). Each page ends in
 * "play it live", with SyncTrip game nights across the city guides.
 */

export type Game = {
  slug: string;
  /** Hero photo: CC-licensed (credited) or our own game-night photo. None = brand gradient. */
  image?: { src: string; alt: string; credit?: { author: string; license: string; url: string } };
  /** Box or cover art, shown beside the heading (whole image visible) instead of a background photo. */
  boxArt?: { src: string; alt: string };
  name: string;
  /** <= 49 chars: the layout appends " | SyncTrip". */
  seoTitle: string;
  /** <= 155 chars. */
  seoDescription: string;
  keywords: string[];
  h1: string;
  tagline: string;
  players: string;
  time: string;
  intro: string[];
  /** Teams or roles, one line each. */
  sides: { name: string; text: string }[];
  howToPlay: string[];
  winning: string[];
  tips: string[];
  faqs: { question: string; answer: string }[];
  related: string[];
};

export const GAMES: Game[] = [
  {
    slug: "mafia",
    boxArt: { src: "/home/game-mafia-box.webp", alt: "Mafia: Vendetta party game box" },
    name: "Mafia",
    seoTitle: "Mafia Game Rules: How to Play (Roles & Tips)",
    seoDescription:
      "Mafia game rules in plain English: roles, night and day phases, how voting works and how each side wins. Plus Mafia game nights near you on SyncTrip.",
    keywords: ["mafia game", "mafia game rules", "how to play mafia", "mafia party game", "mafia card game", "mafia game roles"],
    h1: "Mafia game rules: how to play Mafia with friends",
    tagline: "The classic party game of lying, accusing and voting people out.",
    players: "6–15+ players",
    time: "20–40 min",
    intro: [
      "Mafia is the party game behind Werewolf, Secret Hitler and most social deduction games. A small Mafia team hides among the townspeople; every night they quietly remove someone, and every day the town argues, accuses and votes to eliminate whoever they think is guilty.",
      "You need nothing but people and a narrator. A deck of playing cards works as role cards, which is why Mafia is a staple of college hostels, office parties and game nights.",
    ],
    sides: [
      { name: "Mafia", text: "About one in every four players. They know each other and pick a victim each night." },
      { name: "Townspeople", text: "Everyone else. They don't know who anyone is and must find the Mafia by talking." },
      { name: "Doctor", text: "A townsperson who secretly protects one player each night." },
      { name: "Detective", text: "A townsperson who secretly learns one player's team each night." },
      { name: "Narrator", text: "Not a player. Hands out roles, runs the night and keeps the game moving." },
    ],
    howToPlay: [
      "The narrator deals one secret role card to each player (for example, aces for Mafia, a king for the Doctor, a queen for the Detective, number cards for townspeople).",
      "Night: everyone closes their eyes. The narrator wakes the Mafia, who silently agree on a victim, then the Doctor (who picks someone to save) and the Detective (who points at someone and is shown a thumbs up or down).",
      "Day: everyone opens their eyes. The narrator announces who was eliminated, unless the Doctor saved them. Eliminated players leave the discussion.",
      "The town discusses, accuses and defends. Anyone can nominate a suspect; the group votes, and a majority eliminates that player. In most groups their role is then revealed.",
      "Night and day repeat until one side wins.",
    ],
    winning: [
      "The town wins when every Mafia member has been eliminated.",
      "The Mafia wins when they equal or outnumber the remaining townspeople.",
    ],
    tips: [
      "First game? Use one Mafia per four players, plus a Doctor and a Detective. Add special roles once everyone knows the basics.",
      "Quiet players get voted out first. Say something every day, even if it's just who you trust.",
      "A good narrator makes the game: tell the night's story with a little drama and keep day discussions to about five minutes.",
    ],
    faqs: [
      { question: "How many players do you need for Mafia?", answer: "At least six, and it plays best with eight to fifteen. With more than fifteen, add a second Detective or Doctor and an extra Mafia member." },
      { question: "What is the difference between Mafia and Werewolf?", answer: "They're the same game with a different theme. Werewolf replaces the Mafia with werewolves and the Detective with a Seer, and commercial versions add many extra roles." },
      { question: "Can you play Mafia with playing cards?", answer: "Yes. Pick a card for each role (aces for Mafia, a king for the Doctor, a queen for the Detective) and number cards for townspeople, and deal them face down." },
      { question: "Where can I play Mafia with new people?", answer: "SyncTrip clubs host board-game and social deduction nights at cafés; see the upcoming ones on this page, or post your own Mafia night on the app. Most people come alone." },
    ],
    related: ["werewolf", "secret-hitler", "blood-on-the-clocktower"],
  },
  {
    slug: "secret-hitler",
    boxArt: { src: "/home/game-secret-hitler-box.webp", alt: "Secret Hitler board game box" },
    name: "Secret Hitler",
    seoTitle: "Secret Hitler Rules: How to Play the Game",
    seoDescription:
      "Secret Hitler rules explained: Liberals vs Fascists, how elections and policies work, presidential powers and how each team wins. Find a table on SyncTrip.",
    keywords: ["secret hitler", "secret hitler game", "secret hitler rules", "how to play secret hitler", "secret hitler board game", "secret hitler online"],
    h1: "Secret Hitler rules: how to play, explained simply",
    tagline: "A tense game of elections, policies and a hidden leader, set in 1930s Germany.",
    players: "5–10 players",
    time: "~45 min",
    intro: [
      "Secret Hitler is a social deduction game by Goat Wolf & Cabbage. Players are secretly split into Liberals and Fascists, and one Fascist is Hitler. The Liberals are the majority but don't know who anyone is; the Fascists know each other and need to stay hidden long enough to take over.",
      "Every round the table elects a President and a Chancellor, who pass laws behind a screen of lies. It is one of the best games for a group that likes arguing.",
    ],
    sides: [
      { name: "Liberals", text: "The majority. They don't know anyone's role and must work out who to trust from votes and laws passed." },
      { name: "Fascists", text: "The minority. They know each other (and who Hitler is) and try to pass Fascist laws or get Hitler elected." },
      { name: "Hitler", text: "On the Fascist team. In larger games Hitler doesn't know who the Fascists are, so has to play it safe." },
    ],
    howToPlay: [
      "Deal secret roles. The Fascists open their eyes to see each other and Hitler (in 5–6 player games Hitler sees them too).",
      "The presidency rotates around the table. The presidential candidate nominates a Chancellor, and everyone votes Ja! (yes) or Nein! (no) at the same time.",
      "If the vote fails, the presidency moves on; three failed elections in a row and the top law is passed automatically.",
      "If it passes, the President secretly draws three policy cards, discards one and hands two to the Chancellor, who discards one and enacts the other. The deck has more Fascist than Liberal policies, so bad luck and lies look the same.",
      "Some Fascist policies give the President a power: investigate a player's party, pick the next presidential candidate, peek at the next policies, or execute a player.",
    ],
    winning: [
      "Liberals win by enacting five Liberal policies or by executing Hitler.",
      "Fascists win by enacting six Fascist policies, or if Hitler is elected Chancellor after three Fascist policies are on the board.",
    ],
    tips: [
      "Liberals: track every vote. Who keeps approving the same Chancellor?",
      "After three Fascist policies, never vote in a Chancellor you can't vouch for.",
      "Fascists: pass a Liberal policy now and then to earn trust.",
    ],
    faqs: [
      { question: "How many players do you need for Secret Hitler?", answer: "Five to ten. It plays best with seven to ten, when Hitler no longer knows the other Fascists." },
      { question: "How long does a game of Secret Hitler take?", answer: "Around 30–45 minutes, plus a few minutes to explain the rules on a first game." },
      { question: "Where can I play Secret Hitler in India?", answer: "Board-game cafés and SyncTrip game nights run social deduction games like Secret Hitler. See the upcoming nights on this page, or post your own table on the SyncTrip app." },
    ],
    related: ["avalon", "mafia", "coup"],
  },
  {
    slug: "blood-on-the-clocktower",
    boxArt: { src: "/home/game-botc-cover.webp", alt: "Blood on the Clocktower grimoire cover" },
    name: "Blood on the Clocktower",
    seoTitle: "Blood on the Clocktower: Rules & How to Play",
    seoDescription:
      "Blood on the Clocktower rules for beginners: the Storyteller, good and evil teams, nights, nominations and voting. Join a Clocktower night on SyncTrip.",
    keywords: ["blood on the clocktower", "blood on the clocktower rules", "how to play blood on the clocktower", "botc", "blood on the clocktower trouble brewing"],
    h1: "Blood on the Clocktower: how to play, for first-timers",
    tagline: "The deepest social deduction game there is, run by a Storyteller.",
    players: "5–20 players",
    time: "60–120 min",
    intro: [
      "Blood on the Clocktower, by The Pandemonium Institute, is Mafia grown up. A Demon and its Minions hide in a small town; every player has a unique character with an ability, and a Storyteller runs the game and can bend it to keep it close. Dead players stay in the game, keep talking and still get one last vote, so nobody sits out.",
      "It is best learned at a table with an experienced Storyteller. SyncTrip clubs run Clocktower nights in Chandigarh, and newcomers are always welcome.",
    ],
    sides: [
      { name: "Townsfolk (good)", text: "Most players. Each has a helpful ability, like learning information at night." },
      { name: "Outsiders (good)", text: "Good players whose abilities hurt their own team or confuse it." },
      { name: "Minions (evil)", text: "Know the Demon and help it with abilities that spread lies and misinformation." },
      { name: "Demon (evil)", text: "Kills one player most nights. If the Demon dies, good wins." },
      { name: "Storyteller", text: "Runs the game, gives out information at night, and keeps the game balanced and fun." },
    ],
    howToPlay: [
      "The Storyteller deals each player a secret character from a script. The starter script, Trouble Brewing, is the one to learn on.",
      "Night: players close their eyes. The Storyteller wakes characters one by one to use their abilities and give them information; the Demon chooses a victim.",
      "Day: players talk in groups, swap claims and hunt for the Demon. Remember, Minions and some good characters may be fed false information.",
      "Nominations: players nominate and vote to execute. If the votes reach at least half of the living players, the top-voted player is executed at the end of the day.",
      "Dead players keep their eyes open and keep talking, and each has a single ghost vote for the rest of the game.",
    ],
    winning: [
      "Good wins when the Demon is executed or killed.",
      "Evil wins when only two players are left alive and one of them is the Demon.",
    ],
    tips: [
      "On your first game, tell people what you learned. Information only helps good if it's shared.",
      "Don't trust anything blindly; the Storyteller and evil players both distort information.",
      "Save your ghost vote for the final day.",
    ],
    faqs: [
      { question: "How many players do you need for Blood on the Clocktower?", answer: "Five to fifteen players plus a Storyteller, with room for a few more as 'Travellers'. It plays best with eight to twelve." },
      { question: "How long does Blood on the Clocktower take?", answer: "Usually one to two hours for a full game, depending on the number of players and how much the table talks." },
      { question: "Where can I play Blood on the Clocktower in India?", answer: "SyncTrip clubs host Blood on the Clocktower nights in Chandigarh with an experienced Storyteller. Join the next one on the SyncTrip app; beginners are welcome." },
      { question: "What is Trouble Brewing?", answer: "Trouble Brewing is the beginner script in Blood on the Clocktower. It has simpler characters and is what most groups play first." },
    ],
    related: ["mafia", "werewolf", "secret-hitler"],
  },
  {
    slug: "werewolf",
    boxArt: { src: "/home/game-werewolf-box.webp", alt: "Ultimate Werewolf Deluxe Edition box and role cards" },
    name: "Werewolf",
    seoTitle: "Werewolf Game Rules: Roles & How to Play",
    seoDescription:
      "Werewolf game rules: villagers, werewolves, the Seer and the moderator, night and day phases, and One Night Ultimate Werewolf. Find game nights near you.",
    keywords: ["werewolf game", "werewolf game rules", "how to play werewolf", "werewolf card game", "one night ultimate werewolf"],
    h1: "Werewolf game rules: how to play Werewolf",
    tagline: "Hunt the werewolves in your village before they eat everyone.",
    players: "6–20 players",
    time: "20–45 min",
    intro: [
      "Werewolf is Mafia with a village theme: a few werewolves hide among villagers, kill someone each night, and the village votes each day to find them. Published versions like Ultimate Werewolf add dozens of special roles.",
      "One Night Ultimate Werewolf squeezes the idea into a single ten-minute round, which makes it a great warm-up at a game night.",
    ],
    sides: [
      { name: "Werewolves", text: "Know each other and pick a villager to eliminate each night." },
      { name: "Villagers", text: "The majority, trying to find the werewolves through discussion and votes." },
      { name: "Seer", text: "A villager who secretly learns one player's role each night." },
      { name: "Moderator", text: "Runs the game, wakes roles at night and reveals what happened." },
    ],
    howToPlay: [
      "Deal one role card per player, face down. Use about one werewolf for every four or five players.",
      "Night: everyone closes their eyes. The moderator wakes the werewolves to choose a victim, then the Seer to check one player.",
      "Day: the moderator reveals who was eliminated. The village discusses and votes to eliminate a suspect.",
      "Repeat until one side wins.",
      "One Night version: there's only one night, roles may be swapped while players sleep, and the whole table votes once at the end.",
    ],
    winning: [
      "The village wins when all werewolves are eliminated.",
      "The werewolves win when they equal or outnumber the villagers.",
    ],
    tips: [
      "Seer: don't reveal yourself too early, or you'll be the next night's target.",
      "In One Night Werewolf, claim your role early. The game is short, so information matters more than silence.",
    ],
    faqs: [
      { question: "Is Werewolf the same as Mafia?", answer: "Yes, it's the same core game with a different theme. Werewolf versions usually add more special roles." },
      { question: "What is One Night Ultimate Werewolf?", answer: "A one-round version for 3–10 players that takes about ten minutes, with no moderator needed thanks to an app." },
      { question: "Where can I play Werewolf with new people?", answer: "Join a SyncTrip game night (upcoming ones are listed on this page) or post your own Werewolf night on the app and let people nearby join." },
    ],
    related: ["mafia", "blood-on-the-clocktower", "spyfall"],
  },
  {
    slug: "spyfall",
    boxArt: { src: "/home/game-spyfall-box.webp", alt: "Spyfall party game box" },
    name: "Spyfall",
    seoTitle: "Spyfall Rules: How to Play the Spy Game",
    seoDescription:
      "Spyfall rules in two minutes: one spy, one secret location, a round of questions and a vote. Perfect for 3–8 players. Find game nights near you.",
    keywords: ["spyfall", "spyfall game", "spyfall online", "how to play spyfall", "spyfall rules"],
    h1: "Spyfall rules: how to play the spy game",
    tagline: "Everyone knows where you are, except the spy.",
    players: "3–8 players",
    time: "~10 min a round",
    intro: [
      "Spyfall, by Alexandr Ushan, is a fast question-and-answer game. Everyone gets the same secret location, like a beach or a submarine, except one player: the spy, who has no idea where they are.",
      "Players question each other to sniff out the spy without giving the location away. It's quick, loud and perfect between longer games.",
    ],
    sides: [
      { name: "Non-spies", text: "Know the location and try to find the spy without making it obvious where you are." },
      { name: "The spy", text: "Doesn't know the location and tries to blend in, or work out where everyone is." },
    ],
    howToPlay: [
      "Deal one card to each player: everyone sees the same location, except one player whose card says 'Spy'.",
      "Start a timer (about eight minutes). The dealer asks any player a question about the location, that player answers and then asks someone else.",
      "Answers should prove you know the location, but stay vague enough not to help the spy.",
      "At any time, a player can accuse someone. If everyone else agrees, the round ends and the accused reveals their card.",
      "The spy can stop the round at any moment, reveal and guess the location.",
    ],
    winning: [
      "Non-spies win if they correctly accuse the spy.",
      "The spy wins by guessing the location correctly, or if an innocent player is accused, or if time runs out.",
    ],
    tips: [
      "Ask questions that only work for the real location, like 'How did you get dressed this morning?'",
      "Spy: listen first, answer second. Echo other people's answers.",
    ],
    faqs: [
      { question: "How many players do you need for Spyfall?", answer: "Three to eight. It's at its best with five to eight players." },
      { question: "Can you play Spyfall online?", answer: "Yes, there are free web versions that deal locations to everyone's phone, which also works around a table." },
      { question: "Where can I play party games like Spyfall?", answer: "SyncTrip game nights often mix quick party games like Spyfall with longer social deduction games. See what's coming up on this page." },
    ],
    related: ["werewolf", "coup", "mafia"],
  },
  {
    slug: "coup",
    boxArt: { src: "/home/game-coup-box.webp", alt: "Coup card game box" },
    name: "Coup",
    seoTitle: "Coup Card Game Rules: How to Play",
    seoDescription:
      "Coup card game rules: the five characters, actions, blocks and challenges, and how to win by bluffing. Learn it in five minutes, then play at a game night.",
    keywords: ["coup card game", "coup board game", "coup rules", "how to play coup"],
    h1: "Coup card game rules: how to play Coup",
    tagline: "A 15-minute bluffing game where anyone might be lying.",
    players: "2–6 players",
    time: "~15 min",
    intro: [
      "Coup, by Rikki Tahta, is a tiny card game about bluffing your way to power. Each player has two face-down character cards (their influence) and a couple of coins, and can claim to be any character, whether they hold it or not.",
      "Lose both cards and you're out. Last player standing wins. It's quick, cheap and a favourite warm-up at game nights.",
    ],
    sides: [
      { name: "Duke", text: "Take three coins as tax. Blocks Foreign Aid." },
      { name: "Assassin", text: "Pay three coins to make a player lose a card." },
      { name: "Captain", text: "Steal two coins from another player. Blocks stealing." },
      { name: "Ambassador", text: "Swap cards with the court deck. Blocks stealing." },
      { name: "Contessa", text: "Blocks assassination." },
    ],
    howToPlay: [
      "Each player gets two face-down character cards and two coins.",
      "On your turn take one action: Income (one coin), Foreign Aid (two coins, can be blocked by a Duke), a Coup (pay seven coins to make someone lose a card; you must do this at ten coins), or a character action.",
      "You can claim any character's action or block, whether you hold that card or not.",
      "Anyone can challenge a claim. If you were lying, you lose a card; if you were telling the truth, the challenger loses one and you swap your revealed card for a new one.",
      "A player with no face-down cards left is out.",
    ],
    winning: ["The last player with influence (a face-down card) wins."],
    tips: [
      "Bluff early, when nobody has a read on you yet.",
      "Watch who claims what, and challenge when two people claim the same character too often.",
    ],
    faqs: [
      { question: "How many players can play Coup?", answer: "Two to six, and it's best with four to six." },
      { question: "How long is a game of Coup?", answer: "About fifteen minutes, so groups usually play several rounds." },
    ],
    related: ["secret-hitler", "avalon", "spyfall"],
  },
  {
    slug: "avalon",
    boxArt: { src: "/home/game-avalon-box.webp", alt: "The Resistance: Avalon board game box" },
    name: "Avalon",
    seoTitle: "Avalon Board Game Rules: How to Play",
    seoDescription:
      "The Resistance: Avalon rules: loyal servants of Arthur vs minions of Mordred, quests, team votes, Merlin and the Assassin. Play it at a game night.",
    keywords: ["avalon board game", "the resistance avalon", "avalon rules", "how to play avalon"],
    h1: "Avalon rules: how to play The Resistance: Avalon",
    tagline: "Arthur's knights against Mordred's spies, with no player eliminations.",
    players: "5–10 players",
    time: "~30 min",
    intro: [
      "The Resistance: Avalon, by Don Eskridge, is a social deduction game where nobody gets eliminated. Good players try to complete quests while hidden evil players sabotage them, and Merlin knows who's evil but can't say so openly.",
      "It's a great step up from Mafia for groups who don't want anyone sitting out.",
    ],
    sides: [
      { name: "Loyal Servants of Arthur (good)", text: "The majority. They don't know who's evil." },
      { name: "Merlin (good)", text: "Knows the evil players, but if evil identifies Merlin at the end, evil wins." },
      { name: "Minions of Mordred (evil)", text: "Know each other and try to fail quests." },
      { name: "Assassin (evil)", text: "Gets one guess at Merlin if good completes three quests." },
    ],
    howToPlay: [
      "Deal roles. Evil players open their eyes to see each other; then Merlin is shown who is evil.",
      "The leader proposes a team for the quest. Everyone votes openly to approve or reject.",
      "If approved, the team members secretly play Success or Fail cards. Good players must play Success; evil players may play Fail. One Fail usually fails the quest.",
      "Leadership passes to the left. There are five quests in total.",
      "Optional roles like Percival, Morgana, Mordred and Oberon add more bluffing once the group is comfortable.",
    ],
    winning: [
      "Good wins after three successful quests, unless the Assassin then correctly names Merlin.",
      "Evil wins after three failed quests, or if five team proposals in a row are rejected.",
    ],
    tips: [
      "Merlin: guide the table gently. If you're too obvious, the Assassin will find you.",
      "Watch the team votes as closely as the quest results.",
    ],
    faqs: [
      { question: "What's the difference between Avalon and The Resistance?", answer: "Avalon is a version of The Resistance with an Arthurian theme and special characters like Merlin and the Assassin." },
      { question: "How many players do you need for Avalon?", answer: "Five to ten, and it's best with seven or more." },
    ],
    related: ["secret-hitler", "coup", "blood-on-the-clocktower"],
  },
];

export const getGame = (slug: string) => GAMES.find((g) => g.slug === slug) || null;

/** Feed filter for game-night events and plans across the city guides. */
export const GAME_NIGHT_FILTER = { activities: ["board_games", "mafia", "gaming", "community_space"] };
