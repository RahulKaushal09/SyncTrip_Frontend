/**
 * City guides: "plan it with people" pages, /city/<city> (hub) and /city/<city>/<activity>.
 *
 * Each activity page targets a measured search cluster (Google Ads Keyword Planner,
 * India, Oct 2026) and combines three things nobody else has together:
 *   1. venues for that activity (managed in SyncTrip_Panel → Venues),
 *   2. live SyncTrip club events and open plans for it,
 *   3. a way to go with people instead of alone.
 *
 * Copy rules: every venue, locality and fact must be real and checkable. No invented
 * member counts or ratings. Seasonal claims stay generic so pages don't date.
 */

import { cityImage } from "@/lib/cityImages";

export type GuideFaq = { question: string; answer: string };

export type GuideImage = {
  src: string;
  alt: string;
  /** Required for CC BY / BY-SA photos. */
  credit?: { author: string; license: string; url: string };
};

export type GuideFeedFilter = {
  /** ClubEvent.eventType.activity values. Empty = all events. */
  activities?: string[];
  sports?: string[];
  outings?: string[];
};

export type ActivityGuide = {
  slug: string;
  navLabel: string;
  /** lucide-react icon name, see GUIDE_ICONS in the component. */
  icon: string;
  accent: string;
  /** ≤ 49 chars: the layout appends " | SyncTrip". */
  seoTitle: string;
  /** ≤ 155 chars. */
  seoDescription: string;
  keywords: string[];
  h1: string;
  kicker: string;
  intro: string[];
  image?: GuideImage;
  /** Venues whose `pages` include any of these… */
  venuePages: string[];
  /** …or whose `activities` include any of these. */
  venueActivities?: string[];
  feed: GuideFeedFilter;
  /** Section heading above the venue list. */
  venuesTitle: string;
  tips: { title: string; text: string }[];
  faqs: GuideFaq[];
  related: string[];
};

export type CityGuide = {
  citySlug: string;
  cityName: string;
  state: string;
  geo: { lat: number; lng: number };
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  h1: string;
  kicker: string;
  intro: string[];
  image: GuideImage;
  areas: { name: string; note: string }[];
  /** Hub "areas" section heading + lead, and the lead above each activity page's venue list. */
  areasTitle: string;
  areasSub: string;
  placesSub: string;
  getaways: { name: string; slug: string; distance: string; note: string }[];
  faqs: GuideFaq[];
  activities: ActivityGuide[];
};

/** Pages with fewer venues than this render but stay out of the index and sitemap. */
export const MIN_INDEXABLE_VENUES = 4;

const CC = {
  sukhna: { author: "Biswarup Ganguly (derivative)", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Shikara_-_Sukhna_Lake_-_Chandigarh_2016-08-07_(edit).jpg" },
  goKart: { author: "Henryk Borawski", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Go_Karting_track_in_Bia%C5%82ystok_(Carrefou).jpg" },
  cafe: { author: "Hans Vivek", license: "CC0", url: "https://commons.wikimedia.org/wiki/File:Coffee_Love_(177230717).jpeg" },
  pickleball: { author: "Picklerpeej", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Pickleball_Pros.jpg" },
  sector17: { author: "Medhavigandhi", license: "CC BY 3.0", url: "https://commons.wikimedia.org/wiki/File:Rooster_Fountain,_Sector_17_Chandigarh.jpg" },
  roseGarden: { author: "Harvinder Chandigarh", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Rose_Garden_,Chandigarh,India.jpg" },
  morni: { author: "Manojkhurana", license: "CC BY-SA 3.0", url: "https://commons.wikimedia.org/wiki/File:Morni_Hills_and_Tikkar_Taal,_Haryana,_India_-_8.jpeg" },
  escape: { author: "Hudson Bloom", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Escape_Room_-_%22The_Expedition%22_(Escape_Quest_Bethesda).jpg" },
  cyberHub: { author: "Slyronit", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:DLF_Cyber_Hub,_Gurgaon.jpg" },
  bowling: { author: "RRRW001", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Ten_pin_bowling_alley,_Glenrothes.jpg" },
};

const HOW_SYNCTRIP_WORKS = {
  title: "Don't have a group? That's what SyncTrip is for",
  text: "Open the app, pick the activity and a time, and post it as a plan, or join one someone already posted. People nearby join, you chat in the group, and you meet at the venue.",
};

const CHANDIGARH_ACTIVITIES: ActivityGuide[] = [
  {
    slug: "fun-activities",
    navLabel: "Fun activities",
    icon: "Zap",
    accent: "#F3359E",
    seoTitle: "Fun Activities in Chandigarh with Friends",
    seoDescription:
      "Trampoline parks, go-karting, bowling, escape rooms and paintball in Chandigarh, Mohali and Zirakpur, plus people to go with on SyncTrip.",
    keywords: [
      "fun activities in chandigarh", "trampoline park chandigarh", "go karting chandigarh", "bowling chandigarh",
      "escape room chandigarh", "paintball chandigarh", "adventure activities in chandigarh", "things to do in chandigarh with friends",
    ],
    h1: "Fun activities in Chandigarh: trampoline, go-karting, bowling & escape rooms",
    kicker: "Group outings · Chandigarh tricity",
    intro: [
      "Most of the tricity's high-energy fun sits in two places: the Zirakpur stretch of the Ambala–Chandigarh Expressway (trampolines, go-karting, laser tag) and Elante Mall (bowling, arcades, VR). Add Sector 35's escape rooms and the paintball arenas on the Mohali side and you have a different outing for every weekend.",
      "All of these are better with 4–8 people. If your friends are busy, post a plan on SyncTrip and go with people who are up for the same thing.",
    ],
    image: { src: "/city-guides/activity-go-karting.jpg", alt: "Go-kart track", credit: CC.goKart },
    venuePages: ["fun-activities"],
    feed: { activities: ["bowling", "go_karting", "trampoline", "escape_room", "paintball", "laser_tag"], outings: ["other", "mall"] },
    venuesTitle: "Where to go",
    tips: [
      { title: "Go on a weekday evening", text: "Weekend afternoons are the busiest at trampoline parks and karting tracks. Weekday evenings mean shorter queues and more turns." },
      { title: "Escape rooms need talkers", text: "Pick a team of 4–6 and don't split up too early. Escape rooms reward groups who say everything they find out loud." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which is the best trampoline park in Chandigarh?", answer: "The big ones are all in Zirakpur: HopUp (trampolines plus go-karting, bowling, laser tag and VR), SkyJumper in Oxford Street (100+ trampolines, dodgeball, laser tag) and Woop in Singhpura. HopUp is the best pick if you want several activities in one trip." },
      { question: "Where can I do go-karting in Chandigarh?", answer: "HopUp on the Ambala–Chandigarh Expressway in Zirakpur has an outdoor go-kart track and is the main karting option in the tricity." },
      { question: "Where can I go bowling in Chandigarh?", answer: "Both bowling alleys are in Nexus Elante Mall, Industrial Area Phase I: The Game Palacio (bowling, arcade, VR, open till midnight) and BluO Rhythm & Bowl. HopUp in Zirakpur also has bowling." },
      { question: "Is there an escape room in Chandigarh?", answer: "Yes. Mystery Rooms in Sector 35 runs live escape rooms with themes like a prison break, a murder mystery and a heist. Plan for about an hour and 4–6 players." },
      { question: "How do I find people to go with?", answer: "Post the activity as a plan on SyncTrip with a date and time, or join an open plan. People in Chandigarh who want to do the same thing join, and you coordinate in the plan's chat." },
    ],
    related: ["gaming-board-games", "nightlife", "turf-football-cricket"],
  },
  {
    slug: "cafes-to-meet-people",
    navLabel: "Cafés",
    icon: "Coffee",
    accent: "#B45309",
    seoTitle: "Best Cafés in Chandigarh to Meet People",
    seoDescription:
      "Cafés in Chandigarh's Sector 7, 10, 22, 26 and Mohali where SyncTrip meetups and board-game nights happen. Find a table, and people to share it with.",
    keywords: [
      "cafes in chandigarh", "best cafe in chandigarh", "best cafe in chd", "cafe in sector 10 chandigarh", "cafe in sector 7 chandigarh",
      "cafe in sector 26 chandigarh", "aesthetic cafes in chandigarh", "cafes to hang out with friends chandigarh",
    ],
    h1: "Cafés in Chandigarh where you can actually meet people",
    kicker: "Cafés & meetups · Chandigarh tricity",
    intro: [
      "Chandigarh's café scene clusters by sector: Sector 7 and 26 for lively evenings, Sector 10 and 22 for relaxed central meetups, and Mohali's Sector 68 for the other side of the tricity. These are cafés where SyncTrip has hosted meetups and board-game nights, so they're places that work for groups of strangers, not just dates.",
      "New to the city or tired of the same three people? Join the next café meetup on SyncTrip and walk in knowing there's a table waiting for you.",
    ],
    image: { src: "/city-guides/activity-cafe-friends.jpg", alt: "Coffee on a café table", credit: CC.cafe },
    venuePages: ["cafes-to-meet-people"],
    venueActivities: ["cafe"],
    feed: { activities: ["board_games", "community_space", "mafia"], outings: ["cafe"] },
    venuesTitle: "Cafés that work for meetups",
    tips: [
      { title: "Pick central sectors for first meetups", text: "Sectors 10, 17, 22 and 26 are easy to reach from Mohali and Panchkula, so more people say yes." },
      { title: "Evenings after 6 are best", text: "That's when cafés in Sector 7 and 26 fill up and a group table feels lively rather than empty." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which are the best cafés in Chandigarh to hang out with friends?", answer: "For groups, the Sector 7, 10 and 26 café clusters are the easiest: plenty of seating and close to other things to do. SyncTrip meetups have been hosted at Cafe JC (Sector 10), Ketliwala (Sector 22), Yazu (Sector 26), My Bake Art Cafe (Sector 36) and Wab Coffee Co. (Sector 68, Mohali)." },
      { question: "Where can I meet new people in Chandigarh?", answer: "Café meetups and board-game nights are the lowest-pressure way: you're doing something together, so there's no awkward small talk. SyncTrip Chandigarh runs them regularly; check upcoming events on this page." },
      { question: "Are SyncTrip café meetups free?", answer: "Open plans posted by members are free to join; you pay for your own food and drinks. Club events like board-game nights may have a ticket, shown on the event." },
    ],
    related: ["gaming-board-games", "nightlife", "events-this-weekend"],
  },
  {
    slug: "nightlife",
    navLabel: "Nightlife",
    icon: "Music",
    accent: "#7C3AED",
    seoTitle: "Chandigarh Nightlife: Clubs & a Crew to Go With",
    seoDescription:
      "Chandigarh's best night clubs and pubs in Sector 26, IT Park and Elante, and how to find a group to go out with on SyncTrip instead of going alone.",
    keywords: [
      "chandigarh night club", "chandigarh nightclubs", "best night clubs in chandigarh", "nightlife in chandigarh",
      "pubs in chandigarh", "things to do in chandigarh at night", "karaoke chandigarh", "party in chandigarh",
    ],
    h1: "Chandigarh nightlife: the best clubs, and a crew to go with",
    kicker: "Night out · Chandigarh",
    intro: [
      "Chandigarh's nights run along a few strips: Madhya Marg in Sector 26 for pubs and breweries, the Elante and Industrial Area Phase I side for clubs and live music, and The Lalit in IT Park for the big weekend club nights.",
      "Clubs are more fun (and often easier to get into) as a group. On SyncTrip you can find people heading out the same night: post a nightlife plan or join one, meet first, and go together.",
    ],
    image: { src: "/city-guides/chandigarh-nightlife.jpg", alt: "Crowd at a club night in Chandigarh" },
    venuePages: ["nightlife"],
    venueActivities: ["nightlife", "live_music"],
    feed: { activities: ["music", "karaoke", "party"], outings: ["nightlife"] },
    venuesTitle: "Clubs & pubs",
    tips: [
      { title: "Meet before the club", text: "Do the first hour at a pub or brewery in Sector 26, then move to the club as one group. It's safer and more fun." },
      { title: "Check couple/stag entry rules", text: "Many Chandigarh clubs have entry rules for groups. Going as a mixed group from a SyncTrip plan usually makes this easier." },
      { title: "Plan the ride home", text: "Agree on cab splits in the plan chat before you go, especially for IT Park and Zirakpur." },
    ],
    faqs: [
      { question: "Which are the best night clubs in Chandigarh?", answer: "The well-known names include Kitty Su at The Lalit (IT Park, Friday–Saturday nights), Paara at Centra Mall, and live-music pubs like Peddlers. Sector 26 (Madhya Marg) is the city's main pub-and-brewery strip." },
      { question: "Where can I go out at night in Chandigarh with a group?", answer: "Start in Sector 26 (The Brew Estate, pubs along Madhya Marg) and move on to a club. If you don't have a group, join a nightlife plan on SyncTrip and go with people heading out the same night." },
      { question: "Is it safe to go clubbing with people from an app?", answer: "Meet in a public place first, keep the plan chat for coordination, share your plans with a friend, and arrange your own ride home. On SyncTrip you can see who has joined a plan before you go." },
    ],
    related: ["cafes-to-meet-people", "events-this-weekend", "fun-activities"],
  },
  {
    slug: "gaming-board-games",
    navLabel: "Gaming & board games",
    icon: "Gamepad2",
    accent: "#2785E7",
    seoTitle: "Gaming Cafés & Board Game Nights in Chandigarh",
    seoDescription:
      "Gaming cafés, VR arcades and SyncTrip board-game nights in Chandigarh, Mohali and Kharar. Find players and join the next game night.",
    keywords: [
      "gaming cafe chandigarh", "board game cafe chandigarh", "board games chandigarh", "game night chandigarh",
      "vr games chandigarh", "elante game zone", "gaming zone mohali", "mafia game chandigarh",
    ],
    h1: "Gaming cafés & board game nights in Chandigarh",
    kicker: "Games · Chandigarh tricity",
    intro: [
      "SyncTrip Chandigarh's board-game nights are where a lot of the tricity's newest friendships start: a mixed table, a stack of games, and people you didn't know an hour ago. They run at cafés across the city, and some sell out.",
      "Prefer screens? The gaming lounges and VR arcades below, from Kharar and Mohali to Elante, are better with a squad too. Find players nearby on SyncTrip.",
    ],
    image: { src: "/city-guides/chandigarh-gaming-theory.jpg", alt: "PS5 gaming stations at The Gaming Theory, Kharar", credit: { author: "The Gaming Theory", license: "venue photo", url: "https://www.thegamingtheory.com/" } },
    venuePages: ["gaming-board-games"],
    venueActivities: ["board_games", "gaming", "vr"],
    feed: { activities: ["board_games", "mafia", "gaming", "anime", "community_space"], outings: ["cafe"] },
    venuesTitle: "Gaming spots & game-night venues",
    tips: [
      { title: "First time? Pick a game night", text: "Hosts teach the games, so you don't need to know any rules. It's the easiest way into the community." },
      { title: "Book early", text: "Popular SyncTrip board-game nights fill up. Book your seat when the event goes live." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Is there a board game café in Chandigarh?", answer: "SyncTrip Chandigarh hosts regular board-game nights at cafés like Yazu (Sector 26), Cafe JC (Sector 10), Ketliwala (Sector 22) and My Bake Art Cafe (Sector 36). Upcoming nights are listed on this page." },
      { question: "Where are the gaming cafés in Chandigarh and Mohali?", answer: "Options include Underground Gaming Lounge & Cafe (Sector 125, Kharar), The Gaming Theory (Kharar), High Class VR (Mohali Walk Mall, Sector 62) and the arcade and VR at The Game Palacio, Elante." },
      { question: "Do I need to bring friends to a board-game night?", answer: "No. Many people come alone or with one friend. Tables are mixed so everyone meets new people." },
    ],
    related: ["cafes-to-meet-people", "fun-activities", "events-this-weekend"],
  },
  {
    slug: "pickleball-badminton",
    navLabel: "Pickleball & badminton",
    icon: "Activity",
    accent: "#059669",
    seoTitle: "Pickleball & Badminton Courts in Chandigarh",
    seoDescription:
      "Where to play pickleball and badminton in Chandigarh, Mohali and Panchkula, and how to find doubles partners at your level on SyncTrip.",
    keywords: [
      "pickleball chandigarh", "pickleball court chandigarh", "pickleball mohali", "badminton court chandigarh",
      "badminton court in chandigarh", "badminton partner chandigarh", "padel chandigarh", "pickleball panchkula",
    ],
    h1: "Pickleball & badminton in Chandigarh: courts and people to play with",
    kicker: "Racquet sports · Chandigarh tricity",
    intro: [
      "Pickleball has taken off across the tricity, with dedicated courts from Sector 1 near Sukhna Lake to Kharar and Panchkula, and badminton is the most popular sport plan on SyncTrip.",
      "Both are played in doubles, so you need three more people. Book a court below, then post a SyncTrip sport plan with your level and time slot and let players nearby fill it.",
    ],
    image: { src: "/city-guides/activity-pickleball.jpg", alt: "Pickleball doubles match", credit: CC.pickleball },
    venuePages: ["pickleball-badminton"],
    venueActivities: ["pickleball", "badminton", "padel"],
    feed: { activities: ["badminton", "pickleball", "tennis"], sports: ["badminton", "pickleball", "tennis"] },
    venuesTitle: "Courts",
    tips: [
      { title: "Say your level", text: "Mention beginner / intermediate / advanced in your plan. Mismatched levels are the #1 reason games aren't fun." },
      { title: "Mornings near Sukhna, evenings in Mohali", text: "Courts near Sector 1 are great for sunrise games; Mohali and Zirakpur arenas stay open late." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Where can I play pickleball in Chandigarh?", answer: "Options include Club Cherry (Sukhna Enclave, Sector 1), TerraKort (Kansal, behind the Rock Garden), Project Pickleball (near the CM House, Sector 1), Pickleball Qube (Sector 125, Kharar), The Dugout Arena (Sector 66A, Mohali, 24/7) and Panchkula Pickleball Arena (Sector 16, Panchkula)." },
      { question: "Where can I book a badminton court in Chandigarh?", answer: "Public and association courts in Sectors 37, 40B, 42 and 50 are bookable on Playo. Hours vary by court; Sector 40B is listed as open round the clock." },
      { question: "How do I find badminton or pickleball partners in Chandigarh?", answer: "Post a sport plan on SyncTrip with the game, your level, the court and time. Players nearby join, and you coordinate in the plan chat." },
    ],
    related: ["turf-football-cricket", "outdoors-running", "fun-activities"],
  },
  {
    slug: "turf-football-cricket",
    navLabel: "Turf & box cricket",
    icon: "Trophy",
    accent: "#16A34A",
    seoTitle: "Football Turf & Box Cricket in Chandigarh, Mohali",
    seoDescription:
      "Football turfs and box cricket arenas in Chandigarh, Mohali and Zirakpur, and how to fill your team on SyncTrip when you're short of players.",
    keywords: [
      "turf chandigarh", "turf mohali", "football turf chandigarh", "box cricket mohali", "box cricket chandigarh",
      "turf zirakpur", "futsal mohali", "turf booking chandigarh",
    ],
    h1: "Football turfs & box cricket in Chandigarh, Mohali and Zirakpur",
    kicker: "Team sports · Chandigarh tricity",
    intro: [
      "Most of the tricity's turfs are in Mohali and Zirakpur, from rooftop pitches on malls to 24/7 multi-sport arenas, and they're busiest on weekday evenings after work.",
      "Short of players is the usual problem. Book the slot, post it as a SyncTrip sport plan, and let people nearby join your 5-a-side or box cricket game.",
    ],
    image: { src: "/city-guides/chandigarh-box-cricket.jpg", alt: "Floodlit box cricket turf at night" },
    venuePages: ["turf-football-cricket"],
    venueActivities: ["football", "futsal", "box_cricket", "cricket"],
    feed: { activities: ["football", "cricket", "box_cricket"], sports: ["football", "cricket"] },
    venuesTitle: "Turfs & arenas",
    tips: [
      { title: "Book late slots for cooler games", text: "Rooftop and outdoor turfs are far more pleasant after sunset, especially from April to September." },
      { title: "Split the slot cost", text: "Mention the per-head cost in your plan so everyone knows before joining." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Where is the best football turf in Chandigarh?", answer: "Popular options include The Dugout Arena (Sector 66A, Mohali, open 24/7), Tiki Taka Arena (rooftop, Paras Downtown Square Mall, Zirakpur), Goalazo (Sector 69, Mohali), Ground Zero (Sector 65, Mohali) and Ace Strikers Arena (Highland Marg, Zirakpur)." },
      { question: "Where can I play box cricket in Mohali?", answer: "The Dugout Arena in Sector 66A and Ground Zero in Sector 65 both have box cricket; The Dugout also runs a Zirakpur arena on Nagla Road." },
      { question: "How do I find players for a football match in Chandigarh?", answer: "Create a SyncTrip sport plan with the turf, time and number of players needed. People nearby who want a game join, and you settle the slot cost in the plan chat." },
    ],
    related: ["pickleball-badminton", "fun-activities", "outdoors-running"],
  },
  {
    slug: "events-this-weekend",
    navLabel: "Events this weekend",
    icon: "CalendarDays",
    accent: "#DC2626",
    seoTitle: "Events in Chandigarh This Weekend",
    seoDescription:
      "What's on in Chandigarh this weekend: SyncTrip club events, open plans, comedy shows, exhibitions and fairs, plus people to go with.",
    keywords: [
      "events in chandigarh", "events in chandigarh this weekend", "chandigarh today events", "upcoming events in chandigarh",
      "things to do in chandigarh this weekend", "exhibition in chandigarh", "comedy show in chandigarh", "kalagram chandigarh events",
    ],
    h1: "Events in Chandigarh this weekend",
    kicker: "Updated daily · Chandigarh",
    intro: [
      "This page lists upcoming SyncTrip events and open plans in Chandigarh first (board-game nights, runs, sports and outings you can join today), followed by the venues where the city's comedy, theatre, fairs and exhibitions happen.",
    ],
    image: { src: "/city-guides/landmark-sector-17.jpg", alt: "Rooster fountain, Sector 17 Plaza, Chandigarh", credit: CC.sector17 },
    venuePages: ["events-this-weekend"],
    venueActivities: ["comedy", "theatre", "exhibitions", "fairs"],
    feed: { outings: ["cafe", "nightlife", "mall", "other"], sports: ["badminton", "pickleball", "football", "cricket", "tennis"] },
    venuesTitle: "Where Chandigarh's shows & fairs happen",
    tips: [
      { title: "Don't go alone", text: "Comedy shows and fairs are better in a group. Post the show as a SyncTrip outing and book seats together." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "What events are happening in Chandigarh this weekend?", answer: "The list at the top of this page shows upcoming SyncTrip club events and open plans in Chandigarh, updated throughout the day. For shows and fairs, check Tagore Theatre (Sector 18), The Laugh Club (Sector 26), Punjab Arts Council (Sector 16) and Kalagram (Manimajra)." },
      { question: "Where are exhibitions held in Chandigarh?", answer: "Kalagram on the Chandigarh–Panchkula road hosts crafts fairs and melas, and Punjab Kala Bhawan in Sector 16 hosts art exhibitions." },
      { question: "Where can I watch stand-up comedy in Chandigarh?", answer: "Tagore Theatre in Sector 18 hosts touring comedians, and The Laugh Club in Sector 26 runs shows and open mics." },
    ],
    related: ["cafes-to-meet-people", "nightlife", "workshops"],
  },
  {
    slug: "workshops",
    navLabel: "Workshops & art",
    icon: "Palette",
    accent: "#EA580C",
    seoTitle: "Pottery Classes & Workshops in Chandigarh",
    seoDescription:
      "Pottery classes, art workshops and exhibitions in Chandigarh and Mohali. Learn something new and meet people doing it with SyncTrip.",
    keywords: [
      "pottery class chandigarh", "pottery workshop chandigarh", "art workshop chandigarh", "workshops in chandigarh",
      "exhibition in chandigarh", "art exhibition in chandigarh", "things to do in chandigarh for couples",
    ],
    h1: "Pottery classes, art workshops & exhibitions in Chandigarh",
    kicker: "Learn something · Chandigarh tricity",
    intro: [
      "A pottery wheel or an art workshop is one of the calmest ways to spend a weekend with new people: hands busy, no pressure to keep a conversation going. Chandigarh has studios for complete beginners in the city and on its rural edge.",
      "Found a workshop you like? Post it on SyncTrip and book it with people who want to try it too.",
    ],
    image: { src: "/city-guides/workshops-pottery.jpg", alt: "Handmade glazed pottery from a beginners' workshop" },
    venuePages: ["workshops"],
    venueActivities: ["pottery", "art", "arts", "printmaking", "exhibitions"],
    feed: { activities: ["pottery", "art", "workshop", "dance", "music"] },
    venuesTitle: "Studios & venues",
    tips: [
      { title: "Beginners welcome", text: "Most studios run beginner sessions where you leave with something you made. Mention 'first time' when you book." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Where can I take a pottery class in Chandigarh?", answer: "Claymor Studio in Sector 26 runs classes for beginners to intermediate potters; Aura Pottery runs two-hour workshops at Aura Farm off the Kurali–Chandigarh road; Chandigarh Lalit Kala Akademi runs seasonal pottery and printmaking workshops." },
      { question: "What can couples or friends do in Chandigarh besides cafés?", answer: "Try a pottery workshop, an escape room in Sector 35, bowling at Elante or a comedy show at Tagore Theatre. All of them work for small groups." },
    ],
    related: ["events-this-weekend", "cafes-to-meet-people", "fun-activities"],
  },
  {
    slug: "outdoors-running",
    navLabel: "Runs, walks & cycling",
    icon: "Footprints",
    accent: "#0891B2",
    seoTitle: "Running, Cycling & Walks in Chandigarh",
    seoDescription:
      "Join morning runs at Sukhna Lake, walks in the Rose Garden and Leisure Valley, and Chandigarh running groups like Oye Runner on SyncTrip.",
    keywords: [
      "running club chandigarh", "running group chandigarh", "sukhna lake morning walk", "cycling chandigarh",
      "running in chandigarh", "morning walk chandigarh", "oye runner chandigarh",
    ],
    h1: "Morning runs, walks & cycling in Chandigarh",
    kicker: "Outdoors · Chandigarh",
    intro: [
      "Chandigarh is one of India's best cities to be outdoors in: Sukhna Lake's promenade at sunrise, the Rose Garden and Leisure Valley's long green belt, and wide, tree-lined roads for cycling.",
      "Running groups like Oye Runner meet at Sukhna. Join a run on SyncTrip and start your week with people who'll get you out of bed.",
    ],
    image: { src: "/city-guides/landmark-rose-garden.jpg", alt: "Zakir Hussain Rose Garden, Chandigarh", credit: CC.roseGarden },
    venuePages: ["outdoors-running", "hangout-places"],
    venueActivities: ["running", "cycling", "walks"],
    feed: { activities: ["running", "cycling", "walk", "yoga"] },
    venuesTitle: "Where to run & walk",
    tips: [
      { title: "Sunrise at Sukhna", text: "The lake promenade is best at sunrise, before it gets busy and hot." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Is there a running club in Chandigarh?", answer: "Yes. Oye Runner is a Chandigarh running club on SyncTrip that organises group runs, and Sukhna Lake is the city's favourite meeting point for morning runs." },
      { question: "Where is the best place for a morning walk in Chandigarh?", answer: "Sukhna Lake (Sector 1), the Rose Garden (Sector 16) and the Leisure Valley green belt are the most popular." },
    ],
    related: ["pickleball-badminton", "treks-day-trips", "events-this-weekend"],
  },
  {
    slug: "treks-day-trips",
    navLabel: "Treks & day trips",
    icon: "Mountain",
    accent: "#4D7C0F",
    seoTitle: "Treks & One-Day Trips Near Chandigarh",
    seoDescription:
      "Easy treks and one-day trips near Chandigarh: Morni Hills and Tikkar Taal, Timber Trail and Kasauli. Find people to go with and share the ride on SyncTrip.",
    keywords: [
      "trek near chandigarh", "trekking near chandigarh", "one day trip near chandigarh", "weekend getaways from chandigarh",
      "morni hills", "tikkar taal", "kasauli trip from chandigarh", "timber trail parwanoo",
    ],
    h1: "Treks & one-day trips near Chandigarh",
    kicker: "Day trips · from Chandigarh",
    intro: [
      "The Shivaliks start right where Chandigarh ends. Within two hours you can be on the forest trail to Tikkar Taal in Morni Hills, on the cable car at Timber Trail, or walking through Kasauli's pine forests.",
      "Day trips are cheaper and more fun with a car-full of people. Post a trip or ride on SyncTrip, split fuel, and come back with new friends.",
    ],
    image: { src: "/city-guides/landmark-morni-tikkar-taal.jpg", alt: "Morni Hills near Tikkar Taal, Haryana", credit: CC.morni },
    venuePages: ["treks-day-trips"],
    venueActivities: ["trek", "day_trip", "hike"],
    feed: { activities: ["trek", "hike", "day_trip", "camping"] },
    venuesTitle: "Easy escapes",
    tips: [
      { title: "Leave by 7am", text: "Hill roads get slow by late morning on weekends. An early start means an unhurried day and an evening return." },
      { title: "Share the drive", text: "Post the trip on SyncTrip with seats available; split fuel and tolls in the plan chat." },
    ],
    faqs: [
      { question: "What are the best treks near Chandigarh for beginners?", answer: "The forest trail to Tikkar Taal in Morni Hills (about 45 km away) is the classic easy day trek. Timber Trail at Parwanoo has a steep hike for fitter groups, plus a cable car." },
      { question: "What is a good one-day trip from Chandigarh?", answer: "Morni Hills, Timber Trail (Parwanoo) and Kasauli all work as same-day trips if you leave early." },
    ],
    related: ["outdoors-running", "fun-activities", "events-this-weekend"],
  },
];


const GURGAON_ACTIVITIES: ActivityGuide[] = [
  {
    slug: "fun-activities",
    navLabel: "Trampoline, karting & bowling",
    icon: "Zap",
    accent: "#F3359E",
    seoTitle: "Trampoline, Go-Karting & Bowling in Gurgaon",
    seoDescription:
      "Trampoline parks, go-karting tracks, bowling alleys and escape rooms in Gurgaon, from Sohna Road to Cyber City, plus people to go with on SyncTrip.",
    keywords: [
      "trampoline park gurgaon", "go karting gurgaon", "bowling in gurgaon", "escape room gurgaon",
      "fun activities in gurgaon", "things to do in gurgaon with friends", "game zone gurgaon", "trampoline park in gurugram",
    ],
    h1: "Trampoline parks, go-karting, bowling & escape rooms in Gurgaon",
    kicker: "Group outings · Gurgaon",
    intro: [
      "Gurgaon's fun zones cluster in three places: Sohna Road and Golf Course Extension (trampoline parks, go-karting tracks in Balola, multi-game arenas), Cyber City and Ambience Mall (bowling and arcades), and Golf Course Road (escape rooms).",
      "Every one of these is better with 4–8 people. If your friends are busy, post a plan on SyncTrip and go with people in Gurgaon who are up for the same thing.",
    ],
    image: { src: "/city-guides/activity-go-karting.jpg", alt: "Go-kart track", credit: CC.goKart },
    venuePages: ["fun-activities"],
    feed: { activities: ["bowling", "go_karting", "trampoline", "escape_room", "laser_tag"], outings: ["other", "mall"] },
    venuesTitle: "Where to go",
    tips: [
      { title: "Weekday evenings beat weekends", text: "Trampoline parks and karting tracks are busiest on weekend afternoons. Weekday evenings mean shorter queues and more laps." },
      { title: "Escape rooms need talkers", text: "Pick a team of 4–6 and say everything you find out loud. It's the fastest way to bond with people you've just met." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which is the best trampoline park in Gurgaon?", answer: "Popular options include SkyJumper at ILD Trade Centre (Sector 47, Sohna Road), Zooper in Ardee City (Sector 52), Boombastic on Golf Course Extension Road (trampolines plus bowling and climbing) and Trumpy in Sector 83 for New Gurgaon." },
      { question: "Where can I do go-karting in Gurgaon?", answer: "F9 Go Karting near IFFCO Chowk (Sector 17/18 link road) is the most central. Urban Racer and Turbo Track are both in Balola, off Golf Course Extension Road." },
      { question: "Where can I go bowling in Gurgaon?", answer: "Timezone at Ambience Mall and DLF Cyber Hub, SMAAASH at Airia Mall (Sector 68), Rumble Zone (Sector 57), Skyrider (Sector 70) and Boombastic (Sector 62) all have bowling." },
      { question: "Is there an escape room in Gurgaon?", answer: "Yes. Mystery Rooms on Golf Course Road (DLF Phase 1) and No Escape at M3M Cosmopolitan (Sector 66) run live escape rooms; plan for about an hour and 4–6 players." },
      { question: "How do I find people to go with?", answer: "Post the activity as a plan on SyncTrip with a date and time, or join an open plan. People in Gurgaon who want to do the same thing join, and you coordinate in the plan chat." },
    ],
    related: ["gaming-board-games", "nightlife", "turf-football-cricket"],
  },
  {
    slug: "cafes-to-meet-people",
    navLabel: "Cafés",
    icon: "Coffee",
    accent: "#B45309",
    seoTitle: "Best Cafés in Gurgaon to Meet People",
    seoDescription:
      "Cafés in Gurgaon's Cyber Hub, Galleria, Sector 29 and Golf Course Road that work for meetups and board-game nights, plus people to share a table with.",
    keywords: [
      "cafes in gurgaon", "best cafes in gurgaon", "cafe in cyber hub", "cafes in sector 29 gurgaon",
      "galleria market cafes", "cafes to hang out with friends in gurgaon", "hangout places in gurgaon",
    ],
    h1: "Cafés in Gurgaon where you can actually meet people",
    kicker: "Cafés & meetups · Gurgaon",
    intro: [
      "Gurgaon's café scene runs on four hubs: Cyber Hub for the after-work crowd, Galleria Market and Sector 29 for relaxed weekends, and Golf Course Road for board-game cafés and brunch. These picks work for groups of people who have just met, not only for dates.",
      "Moved to Gurgaon for work and still eating lunch alone? Join a SyncTrip café meetup and walk in knowing there's a table waiting for you.",
    ],
    image: { src: "/city-guides/activity-cafe-friends.jpg", alt: "Coffee on a café table", credit: CC.cafe },
    venuePages: ["cafes-to-meet-people"],
    venueActivities: ["cafe"],
    feed: { activities: ["board_games", "community_space", "mafia"], outings: ["cafe"] },
    venuesTitle: "Cafés that work for meetups",
    tips: [
      { title: "Cyber Hub for weekdays", text: "It's walkable from most Cyber City offices, so after-work meetups get more yeses." },
      { title: "Sector 29 and Galleria for weekends", text: "Slower brunches, more seating and easy to pair with a Leisure Valley walk." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which are the best cafés in Gurgaon to hang out with friends?", answer: "For groups, Cyber Hub (Cafe Delhi Heights, OLLY, Laidback Cafe, SOCIAL) and Galleria Market (Sakley's The Mountain Café) are the easiest. Roots – Cafe in the Park by Leisure Valley in Sector 29 is great for calm weekend mornings." },
      { question: "How do I make friends in Gurgaon?", answer: "Do things together rather than just chat: join a SyncTrip board-game night, a café meetup, a run in Aravali Biodiversity Park or a turf game. Many people come alone, so it's normal to turn up without a group." },
      { question: "Are SyncTrip café meetups free?", answer: "Open plans posted by members are free to join; you pay for your own food and drinks. Club events like board-game nights may have a ticket, shown on the event." },
    ],
    related: ["gaming-board-games", "nightlife", "events-this-weekend"],
  },
  {
    slug: "nightlife",
    navLabel: "Clubs & nightlife",
    icon: "Music",
    accent: "#7C3AED",
    seoTitle: "Clubs in Gurgaon: Nightlife & a Crew to Go With",
    seoDescription:
      "The best clubs, pubs and breweries in Gurgaon's Cyber Hub, Sector 29, Golf Course Road and Sohna Road, and how to find a group to go out with on SyncTrip.",
    keywords: [
      "clubs in gurgaon", "nightlife in gurgaon", "best clubs in gurgaon", "pubs in gurgaon", "cyber hub nightlife",
      "sector 29 gurgaon clubs", "breweries in gurgaon", "things to do in gurgaon at night",
    ],
    h1: "Clubs in Gurgaon: the best nightlife, and a crew to go with",
    kicker: "Night out · Gurgaon",
    intro: [
      "Gurgaon's nights run in clusters: Cyber Hub for after-work pubs and live music, Sector 29 for the original bar-and-club strip, Golf Course Road's malls for breweries, and Sohna Road for newer bars.",
      "Clubs are more fun (and often easier to get into) as a group. On SyncTrip you can find people heading out the same night: post a nightlife plan or join one, meet first, and go together.",
    ],
    image: { src: "/city-guides/chandigarh-nightlife.jpg", alt: "Crowd at a club night" },
    venuePages: ["nightlife"],
    venueActivities: ["nightlife", "live_music"],
    feed: { activities: ["music", "karaoke", "party"], outings: ["nightlife"] },
    venuesTitle: "Clubs, pubs & breweries",
    tips: [
      { title: "Start at Cyber Hub, end in Sector 29", text: "Begin with food and a drink at Cyber Hub and move on as one group." },
      { title: "Check group entry rules", text: "Many Gurgaon clubs have entry rules for groups; going as a mixed group from a SyncTrip plan usually makes it easier." },
      { title: "Plan the ride home", text: "Agree on cab splits in the plan chat before you go, especially from Sohna Road." },
    ],
    faqs: [
      { question: "Which are the best clubs in Gurgaon?", answer: "Popular picks include Feel Alive in Sector 29, the Cyber Hub pubs (Soi 7, Sutra Gastropub, SOCIAL), Manhattan Bar & Brewery at Global Foyer on Golf Course Road and Vapour Bar Exchange on Sohna Road." },
      { question: "Where is the nightlife in Gurgaon?", answer: "The main clusters are DLF Cyber Hub, Sector 29, the Golf Course Road malls and Sohna Road. Cyber Hub is the easiest for an after-work group." },
      { question: "Is it safe to go clubbing with people from an app?", answer: "Meet in a public place first, keep coordination in the plan chat, tell a friend your plans and arrange your own ride home. On SyncTrip you can see who has joined a plan before you go." },
    ],
    related: ["cafes-to-meet-people", "events-this-weekend", "fun-activities"],
  },
  {
    slug: "gaming-board-games",
    navLabel: "Board games & gaming",
    icon: "Gamepad2",
    accent: "#2785E7",
    seoTitle: "Board Game Cafés & Game Nights in Gurgaon",
    seoDescription:
      "Board-game cafés, SyncTrip game nights, VR and gaming arenas in Gurgaon. Come alone, sit at a mixed table and meet people who like the same games.",
    keywords: [
      "board game cafe gurgaon", "board games gurgaon", "game night gurgaon", "gaming zone gurgaon",
      "vr games gurgaon", "game on board gurgaon", "things to do in gurgaon with friends",
    ],
    h1: "Board game cafés & game nights in Gurgaon",
    kicker: "Games · Gurgaon",
    intro: [
      "A board-game night is the easiest way to meet people in Gurgaon: a mixed table, a host who explains the rules, and nobody needs small talk. SyncTrip has hosted game nights on Golf Course Road, and Gurgaon has dedicated board-game cafés with hundreds of games.",
      "Prefer screens? The VR and gaming arenas below are better with a squad too. Find players nearby on SyncTrip.",
    ],
    image: { src: "/city-guides/chandigarh-gaming-theory.jpg", alt: "PS5 gaming stations in a gaming lounge", credit: { author: "The Gaming Theory", license: "venue photo", url: "https://www.thegamingtheory.com/" } },
    venuePages: ["gaming-board-games"],
    venueActivities: ["board_games", "gaming", "vr"],
    feed: { activities: ["board_games", "mafia", "gaming", "anime", "community_space"], outings: ["cafe"] },
    venuesTitle: "Game cafés & arenas",
    tips: [
      { title: "First time? Pick a hosted night", text: "Hosts teach the games, so you don't need to know any rules." },
      { title: "Book early", text: "Popular SyncTrip game nights fill up; book your seat when the event goes live." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Is there a board game café in Gurgaon?", answer: "Yes. Game On Board in Ocus Quantum, Sector 51 has 300+ games and game masters, and Unlocked at 32nd Avenue combines a board-game library with a bar and an escape room. SyncTrip has also hosted game nights at The Big Tree on Golf Course Road." },
      { question: "Do I need to bring friends to a game night?", answer: "No. Many people come alone or with one friend; tables are mixed so everyone meets new people." },
    ],
    related: ["cafes-to-meet-people", "fun-activities", "events-this-weekend"],
  },
  {
    slug: "pickleball-badminton",
    navLabel: "Pickleball & badminton",
    icon: "Activity",
    accent: "#059669",
    seoTitle: "Pickleball & Badminton Courts in Gurgaon",
    seoDescription:
      "Where to play pickleball, padel and badminton in Gurgaon, from Golf Course Extension Road to DLF Phase 3, and how to find doubles partners on SyncTrip.",
    keywords: [
      "pickleball gurgaon", "pickleball court gurgaon", "badminton court gurgaon", "padel gurgaon",
      "badminton partner gurgaon", "pickleball near me gurgaon",
    ],
    h1: "Pickleball & badminton in Gurgaon: courts and people to play with",
    kicker: "Racquet sports · Gurgaon",
    intro: [
      "Gurgaon has some of NCR's best new courts: dedicated pickleball and padel arenas along Golf Course Extension Road, and indoor badminton complexes in Sector 62 and around Sohna Road.",
      "All of these are played in doubles, so you need three more people. Book a court, then post a SyncTrip sport plan with your level and time slot and let players nearby fill it.",
    ],
    image: { src: "/city-guides/activity-pickleball.jpg", alt: "Pickleball doubles match", credit: CC.pickleball },
    venuePages: ["pickleball-badminton"],
    venueActivities: ["pickleball", "badminton", "padel"],
    feed: { activities: ["badminton", "pickleball", "tennis"], sports: ["badminton", "pickleball", "tennis"] },
    venuesTitle: "Courts",
    tips: [
      { title: "Say your level", text: "Mention beginner, intermediate or advanced in your plan. Matched levels make better games." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Where can I play pickleball in Gurgaon?", answer: "Options include CoPlay | The Blue Court (Sector 65), Play Padel at Magnum (Sector 58), The Sports Planet near Badshahpur and Tirang Sports Arena in DLF Phase 3. Most are bookable on Hudle or Playo." },
      { question: "Where can I play badminton in Gurgaon?", answer: "PlayAll in Sector 62 has multiple indoor courts, and The Sports Planet near Badshahpur also has badminton." },
      { question: "How do I find badminton or pickleball partners in Gurgaon?", answer: "Post a sport plan on SyncTrip with the game, your level, the court and time. Players nearby join, and you coordinate in the plan chat." },
    ],
    related: ["turf-football-cricket", "outdoors-running", "fun-activities"],
  },
  {
    slug: "turf-football-cricket",
    navLabel: "Turf & box cricket",
    icon: "Trophy",
    accent: "#16A34A",
    seoTitle: "Football Turf & Box Cricket in Gurgaon",
    seoDescription:
      "Football turfs and box-cricket arenas in Gurgaon, from DLF Phase 3 to Sohna Road, and how to fill your team on SyncTrip when you're short of players.",
    keywords: ["turf gurgaon", "football turf gurgaon", "box cricket gurgaon", "turf booking gurgaon", "5 a side football gurgaon", "cricket turf gurgaon"],
    h1: "Football turfs & box cricket in Gurgaon",
    kicker: "Team sports · Gurgaon",
    intro: [
      "Gurgaon's turfs are busiest on weekday evenings after work, and the most common problem is always the same: two people drop out and nobody wants to pay for an empty slot.",
      "Book the slot, post it as a SyncTrip sport plan, and let people nearby fill your 5-a-side or box-cricket game.",
    ],
    image: { src: "/city-guides/chandigarh-box-cricket.jpg", alt: "Floodlit box cricket turf at night" },
    venuePages: ["turf-football-cricket"],
    venueActivities: ["football", "futsal", "box_cricket", "cricket"],
    feed: { activities: ["football", "cricket", "box_cricket"], sports: ["football", "cricket"] },
    venuesTitle: "Turfs & arenas",
    tips: [
      { title: "Book late slots in summer", text: "Outdoor turfs are far more pleasant after sunset from April to September." },
      { title: "Split the slot cost", text: "Mention the per-head cost in your plan so everyone knows before joining." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Where can I play football or box cricket in Gurgaon?", answer: "Options include Tirang Sports Arena in DLF Phase 3, Future Forward Sports near Hero Honda Road, The Sports Planet near Badshahpur (box-cricket nets) and PlayAll in Sector 62 (cricket turf)." },
      { question: "How do I find players for a football match in Gurgaon?", answer: "Create a SyncTrip sport plan with the turf, time and number of players needed. People nearby join, and you settle the slot cost in the plan chat." },
    ],
    related: ["pickleball-badminton", "fun-activities", "outdoors-running"],
  },
  {
    slug: "events-this-weekend",
    navLabel: "Events this weekend",
    icon: "CalendarDays",
    accent: "#DC2626",
    seoTitle: "Events in Gurgaon This Weekend",
    seoDescription:
      "What's on in Gurgaon this weekend: SyncTrip club events, open plans, stand-up comedy, theatre and exhibitions, plus people to go with.",
    keywords: ["events in gurgaon this weekend", "events in gurgaon", "things to do in gurgaon this weekend", "comedy show gurgaon", "epicentre gurgaon events", "events in gurgaon today"],
    h1: "Events in Gurgaon this weekend",
    kicker: "Updated daily · Gurgaon",
    intro: [
      "This page lists upcoming SyncTrip events and open plans in Gurgaon first (game nights, sports, runs and outings you can join today), followed by the venues where the city's comedy, theatre and exhibitions happen.",
    ],
    image: { src: "/city-guides/gurgaon-cyber-hub.jpg", alt: "DLF Cyber Hub, Gurgaon, at night", credit: CC.cyberHub },
    venuePages: ["events-this-weekend"],
    venueActivities: ["comedy", "theatre", "exhibitions", "concerts"],
    feed: { outings: ["cafe", "nightlife", "mall", "other"], sports: ["badminton", "pickleball", "football", "cricket", "tennis"] },
    venuesTitle: "Where Gurgaon's shows & events happen",
    tips: [
      { title: "Don't go alone", text: "Comedy and live shows are better in a group. Post the show as a SyncTrip outing and book seats together." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "What events are happening in Gurgaon this weekend?", answer: "The list at the top of this page shows upcoming SyncTrip club events and open plans in Gurgaon, updated through the day. For shows, check The Comedy Theatre (Golf Course Road), The Laugh Store (Cyber City) and Epicentre (Sector 44)." },
      { question: "Where can I watch stand-up comedy in Gurgaon?", answer: "The Comedy Theatre at Central Plaza Mall on Golf Course Road and The Laugh Store in DLF Cyber City host regular shows and open mics." },
    ],
    related: ["cafes-to-meet-people", "nightlife", "workshops"],
  },
  {
    slug: "workshops",
    navLabel: "Pottery & workshops",
    icon: "Palette",
    accent: "#EA580C",
    seoTitle: "Pottery Classes & Workshops in Gurgaon",
    seoDescription:
      "Pottery classes, art and resin workshops in Gurgaon, from South City to Sector 54. Learn something new and meet people doing it with SyncTrip.",
    keywords: ["pottery class gurgaon", "pottery workshop gurgaon", "art workshop gurgaon", "workshops in gurgaon", "things to do in gurgaon for couples"],
    h1: "Pottery classes & creative workshops in Gurgaon",
    kicker: "Learn something · Gurgaon",
    intro: [
      "A pottery wheel or a resin-art workshop is one of the calmest ways to spend a Gurgaon weekend with new people: hands busy, no pressure to keep a conversation going. Studios here run sessions for complete beginners.",
      "Found one you like? Post it on SyncTrip and book it with people who want to try it too.",
    ],
    image: { src: "/city-guides/workshops-pottery.jpg", alt: "Handmade glazed pottery from a beginners' workshop" },
    venuePages: ["workshops"],
    venueActivities: ["pottery", "art", "exhibitions"],
    feed: { activities: ["pottery", "art", "workshop", "dance", "music"] },
    venuesTitle: "Studios & venues",
    tips: [{ title: "Beginners welcome", text: "Most studios run beginner sessions where you leave with something you made." }, HOW_SYNCTRIP_WORKS],
    faqs: [
      { question: "Where can I take a pottery class in Gurgaon?", answer: "Sona Pottery (Suncity, Sector 54), Zeventien Ceramics (South City I, Sector 41) and Mustard Studio (Sector 31, which also runs painting and resin-art workshops)." },
      { question: "What can couples or friends do in Gurgaon besides cafés?", answer: "Try a pottery workshop, an escape room on Golf Course Road, bowling at Ambience Mall or Cyber Hub, or a stand-up show at The Comedy Theatre." },
    ],
    related: ["events-this-weekend", "cafes-to-meet-people", "fun-activities"],
  },
  {
    slug: "outdoors-running",
    navLabel: "Runs & cycling",
    icon: "Footprints",
    accent: "#0891B2",
    seoTitle: "Running & Cycling Groups in Gurgaon",
    seoDescription:
      "Morning runs in Aravali Biodiversity Park, walks in Leisure Valley and weekend rides to Damdama Lake. Join Gurgaon running and cycling plans on SyncTrip.",
    keywords: ["running group gurgaon", "running club gurgaon", "cycling group gurgaon", "aravali biodiversity park running", "leisure valley park gurgaon", "morning walk gurgaon"],
    h1: "Running, cycling & morning walks in Gurgaon",
    kicker: "Outdoors · Gurgaon",
    intro: [
      "Gurgaon's best outdoor spaces are right inside the city: the forested trails of Aravali Biodiversity Park, the long green stretch of Leisure Valley in Sector 29, and Aravalli ride routes out to Damdama Lake.",
      "Running and riding groups meet early. Join one on SyncTrip and start the week with people who'll get you out of bed.",
    ],
    image: { src: "/city-guides/gurgaon-running.jpg", alt: "Runners on a road at a group run" },
    venuePages: ["outdoors-running"],
    venueActivities: ["running", "cycling", "walks"],
    feed: { activities: ["running", "cycling", "walk", "yoga"] },
    venuesTitle: "Where to run & ride",
    tips: [{ title: "Go early", text: "From April to October, finish runs before 8am to beat the heat." }, HOW_SYNCTRIP_WORKS],
    faqs: [
      { question: "Where is the best place to run in Gurgaon?", answer: "Aravali Biodiversity Park in DLF Phase 3 has a jogging track over forested trails and is where many running groups meet. Leisure Valley Park in Sector 29 is the flatter, central option." },
      { question: "Are there cycling groups in Gurgaon?", answer: "Yes, several groups ride on weekends, and Damdama Lake near Sohna is the classic breakfast-ride destination. Find a ride or post your own on SyncTrip." },
    ],
    related: ["pickleball-badminton", "treks-day-trips", "events-this-weekend"],
  },
  {
    slug: "treks-day-trips",
    navLabel: "Day trips",
    icon: "Mountain",
    accent: "#4D7C0F",
    seoTitle: "Day Trips & Weekend Rides from Gurgaon",
    seoDescription:
      "Easy day trips from Gurgaon: Damdama Lake, Sultanpur National Park and Neemrana Fort. Find people to go with and share the ride on SyncTrip.",
    keywords: ["day trip from gurgaon", "one day trip near gurgaon", "weekend getaways from gurgaon", "damdama lake", "sultanpur national park", "neemrana fort day trip"],
    h1: "Day trips & weekend rides from Gurgaon",
    kicker: "Day trips · from Gurgaon",
    intro: [
      "You're out of Gurgaon and into the Aravallis in under an hour: Damdama Lake for a breakfast ride, Sultanpur for winter birdwatching, or a 15th-century fort at Neemrana down NH-48.",
      "Day trips are cheaper and more fun with a car-full of people. Post a trip or ride on SyncTrip, split fuel, and come back with new friends.",
    ],
    image: { src: "/city-guides/gurgaon-neemrana.jpg", alt: "Neemrana Fort-Palace lit up at dusk" },
    venuePages: ["treks-day-trips"],
    venueActivities: ["day_trip", "hike"],
    feed: { activities: ["trek", "hike", "day_trip", "camping", "riding"] },
    venuesTitle: "Easy escapes",
    tips: [{ title: "Leave early", text: "Start by 6–7am on weekends to beat NH-48 and Sohna Road traffic." }, { title: "Share the drive", text: "Post the trip with seats available and split fuel and tolls in the plan chat." }],
    faqs: [
      { question: "What is a good one-day trip from Gurgaon?", answer: "Damdama Lake near Sohna, Sultanpur National Park on the Farukhnagar road and Neemrana Fort-Palace on NH-48 all work as same-day trips." },
    ],
    related: ["outdoors-running", "fun-activities", "events-this-weekend"],
  },
];

const CC_NCR = {
  indiaGate: { author: "Mike_fleming from London, England", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:India_Gate_-_Delhi_(37282946605).jpg" },
  lodhi: { author: "Slyronit", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:A_path_in_Lodhi_Gardens,_Delhi.jpg" },
  noidaSkyline: { author: "Edmund Gall", license: "CC BY-SA 2.0", url: "https://commons.wikimedia.org/wiki/File:View_of_Noida_city_from_the_Hilton_Noida.jpg" },
  okhla: { author: "Danish971", license: "CC BY-SA 4.0", url: "https://commons.wikimedia.org/wiki/File:Okhla_Bird_Sanctuary.jpg" },
};

/* Delhi. Keyword Planner (India, Oct 2026): trampoline park delhi 40.5k, cafes in delhi 22.2k,
   clubs in delhi 22.2k, go karting delhi 18.1k, best cafes in delhi 18.1k, places to visit near
   delhi 18.1k, things to do in delhi 14.8k, parks in delhi 9.9k, events in delhi 8.1k, concerts
   in delhi 8.1k. Venues: SyncTrip_SEO/delhi/venues-seed-delhi.json (cityName Delhi-NCR). */
const DELHI_ACTIVITIES: ActivityGuide[] = [
  {
    slug: "fun-activities",
    navLabel: "Trampoline, karting & bowling",
    icon: "Zap",
    accent: "#F3359E",
    seoTitle: "Trampoline Parks, Bowling & Go-Karting Delhi",
    seoDescription:
      "Trampoline parks, bowling alleys, escape rooms and the nearest go-karting tracks to Delhi, from Rohini to Dwarka and CP, plus people to go with.",
    keywords: [
      "trampoline park delhi", "go karting delhi", "bowling delhi", "escape room delhi", "game zone delhi",
      "fun activities in delhi", "fun places in delhi", "things to do in delhi with friends",
    ],
    h1: "Trampoline parks, bowling, escape rooms & go-karting near Delhi",
    kicker: "Group outings · Delhi",
    intro: [
      "Delhi's fun zones live in its malls: SkyJumper's trampoline park in Rohini, bowling and arcades at Timezone in Pacific Mall and Vegas Mall Dwarka, SMAAASH in Rajouri Garden, and Mystery Rooms' escape rooms in Connaught Place and Rajouri Garden. There's no go-karting track inside city limits; the nearest are Formula 11 in Noida and F9 and Kartomania in Gurgaon.",
      "All of these are better with 4–8 people. If your friends are busy, post a plan on SyncTrip and go with people in Delhi who are up for the same thing.",
    ],
    image: { src: "/city-guides/activity-go-karting.jpg", alt: "Go-kart track", credit: CC.goKart },
    venuePages: ["fun-activities"],
    feed: { activities: ["bowling", "go_karting", "trampoline", "escape_room", "laser_tag"], outings: ["other", "mall"] },
    venuesTitle: "Where to go",
    tips: [
      { title: "Weekday evenings beat weekends", text: "Mall game zones are packed on weekend afternoons. Weekday evenings mean shorter queues and more games for the same money." },
      { title: "Want to go karting?", text: "The closest tracks are Formula 11 at Worlds of Wonder, Noida (Sector 38A, near the Botanical Garden metro) and F9 or Kartomania in Gurgaon. Make it a group trip and split the cab." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which is the best trampoline park in Delhi?", answer: "SkyJumper inside Adventure Island at Metro Walk Mall, Rohini is Delhi's best-known trampoline park, with a foam pit, basketball hoops and laser tag. In Noida, SkyJumper also has a park at Wave Mall, Sector 18." },
      { question: "Where can I go go-karting near Delhi?", answer: "There's no karting track inside Delhi city limits. The nearest are Formula 11 Karting at Worlds of Wonder in Noida Sector 38A, one of India's biggest tracks, and F9 Go Karting and Kartomania in Gurgaon." },
      { question: "Where can I go bowling in Delhi?", answer: "Timezone at Pacific Mall (Tagore Garden) and at Vegas Mall (Dwarka) both have bowling lanes plus arcades and VR, and SMAAASH at R Cube Monad Mall in Rajouri Garden has twilight bowling and cricket simulators." },
      { question: "Is there an escape room in Delhi?", answer: "Yes. Mystery Rooms runs escape rooms in Connaught Place and Rajouri Garden. Plan for about an hour and a team of 4–6 people." },
      { question: "How do I find people to go with?", answer: "Post the activity as a plan on SyncTrip with a date and time, or join an open plan. People in Delhi who want to do the same thing join, and you coordinate in the plan chat." },
    ],
    related: ["gaming-board-games", "nightlife", "turf-football-cricket"],
  },
  {
    slug: "cafes-to-meet-people",
    navLabel: "Cafés",
    icon: "Coffee",
    accent: "#B45309",
    seoTitle: "Best Cafés in Delhi to Meet People",
    seoDescription:
      "The best cafés in Delhi for meetups: Hauz Khas, Shahpur Jat and Connaught Place picks that work for groups who've just met, and people to go with.",
    keywords: [
      "cafes in delhi", "best cafes in delhi", "hangout places in delhi", "cafes in hauz khas",
      "cafes in connaught place", "cafes in shahpur jat", "cafes to hang out with friends in delhi",
    ],
    h1: "Cafés in Delhi where you can actually meet people",
    kicker: "Cafés & meetups · Delhi",
    intro: [
      "Delhi's best cafés for meeting people cluster in three places: Hauz Khas Village for big terraces and live music, Shahpur Jat for calm, bookish corners, and Connaught Place for old-school coffee houses in the middle of the city. These picks work for a group of people who have just met, not only for dates.",
      "New to Delhi, or your friends live an hour away? Join a SyncTrip café meetup and walk in knowing there's a table waiting for you.",
    ],
    image: { src: "/city-guides/activity-cafe-friends.jpg", alt: "Coffee on a café table", credit: CC.cafe },
    venuePages: ["cafes-to-meet-people"],
    venueActivities: ["cafe"],
    feed: { activities: ["board_games", "community_space", "mafia"], outings: ["cafe"] },
    venuesTitle: "Cafés that work for meetups",
    tips: [
      { title: "Hauz Khas for groups", text: "Summer House Cafe and Hauz Khas Social have the space for a big table and an evening that turns into a night out." },
      { title: "Shahpur Jat and CP for small meetups", text: "Ivy & Bean, Cha Bar and United Coffee House are calmer, which suits a first meetup of two to four people." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which are the best cafés in Delhi to hang out with friends?", answer: "For groups, Summer House Cafe and Hauz Khas Social in Hauz Khas, and Potbelly Rooftop Cafe in Shahpur Jat. For a calmer catch-up, Ivy & Bean in Shahpur Jat, Cha Bar in Oxford Bookstore and United Coffee House in Connaught Place." },
      { question: "How do I make friends in Delhi?", answer: "Do things together rather than just chat: join a SyncTrip café meetup, a morning walk in Lodhi Garden, a pickleball game in Saket or a comedy night. Many people come alone, so it's normal to turn up without a group." },
      { question: "Are SyncTrip café meetups free?", answer: "Open plans posted by members are free to join; you pay for your own food and drinks. Club events like board-game nights may have a ticket, shown on the event." },
    ],
    related: ["nightlife", "events-this-weekend", "gaming-board-games"],
  },
  {
    slug: "nightlife",
    navLabel: "Clubs & nightlife",
    icon: "Music",
    accent: "#7C3AED",
    seoTitle: "Clubs in Delhi: Nightlife, Pubs & Bars",
    seoDescription:
      "Clubs in Delhi and where to go out: Connaught Place, Aerocity and Hauz Khas Village, from big DJ nights to easy pubs, plus a group to go with on SyncTrip.",
    keywords: [
      "clubs in delhi", "nightlife in delhi", "pubs in delhi", "bars in delhi",
      "hauz khas village bars", "clubs in connaught place", "aerocity clubs",
    ],
    h1: "Clubs, pubs and nightlife in Delhi",
    kicker: "Nights out · Delhi",
    intro: [
      "Delhi goes out in three places. Connaught Place has the big hotel clubs like Kitty Su and Privee, Aerocity has glamorous late-night spots like Toy Room, and Hauz Khas Village has the relaxed bars and terraces: Hauz Khas Social, Summer House Cafe and Raasta.",
      "A night out works best with a group. If yours is busy, find people who are going out the same night on SyncTrip.",
    ],
    image: { src: "/city-guides/chandigarh-nightlife.jpg", alt: "Crowd at a club night" },
    venuePages: ["nightlife"],
    venueActivities: ["nightlife", "live_music"],
    feed: { activities: ["music", "karaoke", "party"], outings: ["nightlife"] },
    venuesTitle: "Clubs, pubs & bars",
    tips: [
      { title: "Start early", text: "Most Delhi venues wind down around 1 am, so meet by 9 if you want a long night." },
      { title: "Check the door policy", text: "CP and Aerocity clubs have dress codes and stricter doors than Hauz Khas bars. Groups with a mix of people usually get in more easily." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which are the best clubs in Delhi?", answer: "Kitty Su at The Lalit and Privee at the Shangri-La Eros near Connaught Place, and Toy Room at the Aloft in Aerocity, are Delhi's best-known clubs. For a relaxed night, try the bars in Hauz Khas Village." },
      { question: "Where is the best nightlife in Delhi?", answer: "Hauz Khas Village for casual bars and terraces, Connaught Place for hotel clubs and pubs, and Aerocity for upscale late-night clubs." },
      { question: "What time do clubs close in Delhi?", answer: "Most bars and clubs close around 1 am, while a few Aerocity clubs run later on weekends. Check the venue before you plan a late night." },
    ],
    related: ["cafes-to-meet-people", "events-this-weekend", "fun-activities"],
  },
  {
    slug: "gaming-board-games",
    navLabel: "Board games & gaming",
    icon: "Gamepad2",
    accent: "#2785E7",
    seoTitle: "Gaming Cafés & Board Game Nights in Delhi",
    seoDescription:
      "Gaming cafés in Delhi with PS5, VR and gaming PCs, from Malviya Nagar to Preet Vihar, plus board-game nights on SyncTrip. Find a squad near you.",
    keywords: [
      "gaming cafe delhi", "board game cafe delhi", "ps5 gaming cafe delhi", "gaming zone delhi",
      "board games delhi", "vr gaming delhi",
    ],
    h1: "Gaming cafés and board-game nights in Delhi",
    kicker: "Games nights · Delhi",
    intro: [
      "Delhi's gaming scene is spread across student and office hubs: Gamer's Den in Malviya Nagar for PS5 and VR, Squad Gaming near South Extension and Underground Vault in Lajpat Nagar for PC squads, Immortal Gaming Cafe in Satya Niketan and Lan Shack in Preet Vihar for tournaments.",
      "Dedicated board-game cafés are rare in Delhi, so the best board-game nights are the ones people organise. Join one on SyncTrip, or post your own and pick the café.",
    ],
    image: { src: "/city-guides/chandigarh-gaming-theory.jpg", alt: "PS5 gaming stations in a gaming lounge", credit: { author: "The Gaming Theory", license: "venue photo", url: "https://www.thegamingtheory.com/" } },
    venuePages: ["gaming-board-games"],
    venueActivities: ["board_games", "gaming", "vr"],
    feed: { activities: ["board_games", "mafia", "gaming", "anime", "community_space"], outings: ["cafe"] },
    venuesTitle: "Gaming cafés & arenas",
    tips: [
      { title: "Book consoles ahead", text: "PS5 stations are fewer than PCs in most cafés, so call ahead for a group console session on weekends." },
      { title: "Bring the board games", text: "Most cafés are happy to host a board-game night on a quiet weekday. Post it on SyncTrip and bring Catan or a party game." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which is the best gaming café in Delhi?", answer: "Gamer's Den in Malviya Nagar (PS5, VR and PCs), Squad Gaming near South Extension, Underground Vault in Lajpat Nagar, Immortal Gaming Cafe in Satya Niketan and Lan Shack in Preet Vihar are popular with Delhi gamers." },
      { question: "Is there a board game café in Delhi?", answer: "Dedicated board-game cafés are rare in Delhi. SyncTrip members run board-game nights at cafés across the city; join one or post your own." },
      { question: "How much does a gaming café cost in Delhi?", answer: "Most Delhi gaming cafés charge by the hour, roughly ₹50–200 depending on the setup, with consoles at the higher end. Check the café's current rates before you go." },
    ],
    related: ["fun-activities", "cafes-to-meet-people", "events-this-weekend"],
  },
  {
    slug: "pickleball-badminton",
    navLabel: "Pickleball & badminton",
    icon: "Activity",
    accent: "#059669",
    seoTitle: "Pickleball & Badminton Courts in Delhi",
    seoDescription:
      "Pickleball and badminton courts in Delhi: Saket, Mehrauli, Chhattarpur and Vasant Vihar, plus doubles partners and regular groups on SyncTrip.",
    keywords: [
      "pickleball delhi", "pickleball court delhi", "badminton court delhi", "badminton academy delhi",
      "padel delhi", "pickleball near me delhi",
    ],
    h1: "Pickleball and badminton courts in Delhi",
    kicker: "Racquet sports · Delhi",
    intro: [
      "Pickleball has taken over South Delhi: courts at Fusion Play Arena in Select Citywalk, Rackonnect's padel park in Mehrauli, House of Padel in Chhattarpur, and club courts in Vasant Vihar and Anand Niketan. For badminton, Smash2Play in Saket has courts alongside its turf.",
      "Doubles needs four people. Post a game on SyncTrip with your court and time, and players nearby fill the spots.",
    ],
    image: { src: "/city-guides/activity-pickleball.jpg", alt: "Pickleball doubles match", credit: CC.pickleball },
    venuePages: ["pickleball-badminton"],
    venueActivities: ["pickleball", "badminton", "padel"],
    feed: { activities: ["badminton", "pickleball", "tennis"], sports: ["badminton", "pickleball", "tennis"] },
    venuesTitle: "Courts",
    tips: [
      { title: "Book late slots", text: "Several South Delhi courts stay open late, so an after-work game is easier to fill than a weekend morning." },
      { title: "New to pickleball?", text: "It's quick to learn. Join a beginners' plan on SyncTrip and you'll be rallying in your first hour." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Where can I play pickleball in Delhi?", answer: "Fusion Play Arena at Nexus Select Citywalk (Saket), Rackonnect in Mehrauli, House of Padel in Chhattarpur, Vasant Vihar Club and the Spordemy courts at Anand Niketan Club are popular South Delhi options." },
      { question: "How do I find a doubles partner in Delhi?", answer: "Post a pickleball or badminton plan on SyncTrip with the court and time. Players nearby join, and you can keep playing with the ones you click with." },
      { question: "Is pickleball easy for beginners?", answer: "Yes. The court is small and the rules are simple, so most people can play a fun game in their first session." },
    ],
    related: ["turf-football-cricket", "outdoors-running", "fun-activities"],
  },
  {
    slug: "turf-football-cricket",
    navLabel: "Turf & box cricket",
    icon: "Trophy",
    accent: "#16A34A",
    seoTitle: "Box Cricket & Football Turfs in Delhi",
    seoDescription:
      "Box cricket and football turfs in Delhi: Dwarka, Rohini, Pitampura and Saket, with floodlit evening slots, plus players to fill your team on SyncTrip.",
    keywords: [
      "turf delhi", "box cricket delhi", "football turf delhi", "cricket turf delhi",
      "box cricket near me", "5 a side football delhi",
    ],
    h1: "Box cricket and football turfs in Delhi",
    kicker: "Turf games · Delhi",
    intro: [
      "Delhi's best turfs are in the west and north: PlayAll at DIS Dwarka and Dwarka Sports Arena in Sector 11, M10 in Rohini and ClayGrounds in Pitampura, with Smash2Play in Saket for South Delhi. Most are floodlit, so evening games are the norm.",
      "The hardest part is getting ten people on the same night. Post the slot on SyncTrip and players nearby fill it.",
    ],
    image: { src: "/city-guides/chandigarh-box-cricket.jpg", alt: "Floodlit box cricket turf at night" },
    venuePages: ["turf-football-cricket"],
    venueActivities: ["football", "futsal", "box_cricket", "cricket"],
    feed: { activities: ["football", "cricket", "box_cricket"], sports: ["football", "cricket"] },
    venuesTitle: "Turfs & arenas",
    tips: [
      { title: "Split the turf fee", text: "Turfs charge per slot, so a full side makes it cheap. Post the game with the per-person cost so people know up front." },
      { title: "Play after 8 pm in summer", text: "Floodlit late slots are cooler and easier to book than early evening." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Where can I play box cricket in Delhi?", answer: "PlayAll at DIS Dwarka, Dwarka Sports Arena (Sector 11), M10 in Rohini Sector 9, ClayGrounds in Pitampura and Smash2Play in Saket all have box cricket." },
      { question: "Where is the best football turf in Delhi?", answer: "Dwarka has the most options (PlayAll at DIS Dwarka, Dwarka Sports Arena), while M10 in Rohini and ClayGrounds in Pitampura serve North Delhi." },
      { question: "How do I find players for a turf game?", answer: "Post the game on SyncTrip with the turf, time and cost per person. People nearby join until the side is full." },
    ],
    related: ["pickleball-badminton", "fun-activities", "outdoors-running"],
  },
  {
    slug: "events-this-weekend",
    navLabel: "Events this weekend",
    icon: "CalendarDays",
    accent: "#DC2626",
    seoTitle: "Events in Delhi This Weekend: Gigs & Comedy",
    seoDescription:
      "Events in Delhi this weekend: live jazz, comedy, theatre and SyncTrip club events, plus people to go with. Updated with what's on near you.",
    keywords: [
      "events in delhi", "events in delhi this weekend", "concerts in delhi", "comedy show delhi",
      "things to do in delhi this weekend", "live music delhi",
    ],
    h1: "Events in Delhi this weekend: gigs, comedy and club nights",
    kicker: "What's on · Delhi",
    intro: [
      "Delhi's weekend line-up runs from jazz at The Piano Man in Safdarjung Enclave and gigs at Summer House Cafe in Hauz Khas, to stand-up at The Laugh Store in Dwarka and plays and improv at Akshara Theatre near CP. Below are SyncTrip club events and open plans happening this week.",
      "Going to a gig or a comedy night alone is easier when you meet people there. Join a plan, or post one for the show you want to see.",
    ],
    image: { src: "/home/meetup-reel-poster.webp", alt: "A SyncTrip board-game night: a full table of new friends" },
    venuePages: ["events-this-weekend"],
    venueActivities: ["comedy", "theatre", "exhibitions", "concerts"],
    feed: { outings: ["cafe", "nightlife", "mall", "other"], sports: ["badminton", "pickleball", "football", "cricket", "tennis"] },
    venuesTitle: "Where Delhi's shows & gigs happen",
    tips: [
      { title: "Book jazz nights early", text: "The Piano Man fills up on weekends. Reserve ahead, and expect a cover charge for some acts." },
      { title: "Be on time at Akshara", text: "Akshara's hosts are strict about latecomers, so plan to arrive early." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "What are the best events in Delhi this weekend?", answer: "Check live jazz at The Piano Man, gigs at Summer House Cafe, stand-up at The Laugh Store and plays at Akshara Theatre, plus the SyncTrip club events and open plans listed on this page." },
      { question: "Where can I watch stand-up comedy in Delhi?", answer: "The Laugh Store in Dwarka is a dedicated comedy club, Akshara Theatre hosts comics and improv, and The Piano Man runs comedy nights alongside jazz." },
      { question: "Where can I find people to go to events with?", answer: "Join an open plan on SyncTrip or post one for the event you want to see. People heading the same way join, and you meet there." },
    ],
    related: ["nightlife", "cafes-to-meet-people", "workshops"],
  },
  {
    slug: "workshops",
    navLabel: "Pottery & workshops",
    icon: "Palette",
    accent: "#EA580C",
    seoTitle: "Pottery Classes & Workshops in Delhi",
    seoDescription:
      "Pottery classes and art workshops in Delhi for beginners: Hauz Khas, Lado Sarai and Ghitorni studios, plus a group to go with on SyncTrip.",
    keywords: [
      "pottery workshop delhi", "pottery class delhi", "workshops in delhi", "art workshop delhi",
      "pottery classes in hauz khas", "weekend workshops delhi",
    ],
    h1: "Pottery classes and creative workshops in Delhi",
    kicker: "Workshops · Delhi",
    intro: [
      "South Delhi is the place for pottery: Naveen Chhaya Ceramic Studio near Deer Park and ChalkBoard in Hauz Khas Village, Kachi Maati in Lado Sarai, and weekend courses at Zorba The Buddha in Ghitorni. Most offer single sessions, so you don't have to sign up for a course to try.",
      "A workshop is one of the easiest ways to meet people: hands busy, plenty to talk about. Book one with a SyncTrip group.",
    ],
    image: { src: "/city-guides/workshops-pottery.jpg", alt: "Handmade glazed pottery from a beginners' workshop" },
    venuePages: ["workshops"],
    venueActivities: ["pottery", "art", "exhibitions"],
    feed: { activities: ["pottery", "art", "workshop", "dance", "music"] },
    venuesTitle: "Studios & venues",
    tips: [
      { title: "Start with a single session", text: "Most studios run one-off beginner sessions. Try one before committing to a course." },
      { title: "Go in a small group", text: "Studios keep classes small, so a group of three or four is ideal. Post the session on SyncTrip." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Where can I take a pottery class in Delhi?", answer: "Naveen Chhaya Ceramic Studio and ChalkBoard in Hauz Khas, Kachi Maati in Lado Sarai and Zorba The Buddha in Ghitorni all run beginner sessions." },
      { question: "Do I need experience for a pottery workshop?", answer: "No. Beginner sessions start from the basics of centring and shaping clay." },
      { question: "Can I go to a workshop alone?", answer: "Yes, and many people do. Joining a SyncTrip plan means you'll already know a few people at the table." },
    ],
    related: ["events-this-weekend", "cafes-to-meet-people", "outdoors-running"],
  },
  {
    slug: "outdoors-running",
    navLabel: "Parks, runs & walks",
    icon: "Footprints",
    accent: "#0891B2",
    seoTitle: "Best Parks in Delhi for Runs & Walks",
    seoDescription:
      "The best parks in Delhi for running and walks: Lodhi Garden, Sunder Nursery, Nehru Park and Sanjay Van, plus running groups and walking buddies.",
    keywords: [
      "parks in delhi", "best parks in delhi", "running club delhi", "lodhi garden",
      "sunder nursery", "places to walk in delhi", "cycling delhi",
    ],
    h1: "The best parks in Delhi for runs, walks and weekend mornings",
    kicker: "Outdoors · Delhi",
    intro: [
      "Delhi is one of India's greenest capitals. Lodhi Garden is the city's favourite running loop, Sunder Nursery next to Humayun's Tomb is made for slow weekend walks, Nehru Park in Chanakyapuri has long jogging paths, and Sanjay Van's Ridge trails are the closest thing to a forest run.",
      "Mornings are easier with company. Join a SyncTrip run or walk and meet people who show up every week.",
    ],
    image: { src: "/city-guides/delhi-lodhi-garden.jpg", alt: "A shaded path in Lodhi Garden, Delhi", credit: CC_NCR.lodhi },
    venuePages: ["outdoors-running"],
    venueActivities: ["running", "cycling", "walks"],
    feed: { activities: ["running", "cycling", "walk", "yoga"] },
    venuesTitle: "Where to run & walk",
    tips: [
      { title: "Go early in summer", text: "From April to June, run before 7 am. In winter, mid-morning walks are best once the smog lifts." },
      { title: "Check the air", text: "On high-AQI days, swap the run for an indoor plan like pickleball or a gaming night." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which are the best parks in Delhi for running?", answer: "Lodhi Garden is the most popular running loop, Nehru Park in Chanakyapuri has long paths, and Sanjay Van in Mehrauli has trail runs. Sunder Nursery is best for walks." },
      { question: "Are there running groups in Delhi?", answer: "Yes. Many groups run in Lodhi Garden and Nehru Park on weekend mornings. On SyncTrip you can join a group run or post your own." },
      { question: "Is Lodhi Garden free?", answer: "Lodhi Garden is free to enter and opens early in the morning. Sunder Nursery has a small entry ticket." },
    ],
    related: ["pickleball-badminton", "treks-day-trips", "workshops"],
  },
  {
    slug: "treks-day-trips",
    navLabel: "Day trips",
    icon: "Mountain",
    accent: "#4D7C0F",
    seoTitle: "Places to Visit Near Delhi: Day Trips",
    seoDescription:
      "Places to visit near Delhi for a day: Asola Bhatti, Mangar Bani and Surajkund for a morning, Neemrana and Agra for a full day, plus a group to go with.",
    keywords: [
      "places to visit near delhi", "one day trip from delhi", "day trips from delhi", "weekend getaways from delhi",
      "treks near delhi", "places near delhi for weekend",
    ],
    h1: "Places to visit near Delhi: day trips and easy escapes",
    kicker: "Day trips · Delhi",
    intro: [
      "You don't have to leave the city to get out of it. Asola Bhatti Wildlife Sanctuary is on Delhi's southern ridge, Mangar Bani's forest is an hour away on the Gurgaon–Faridabad road, and Surajkund is just past the southern border. For a full day, Neemrana and Agra are easy drives.",
      "Day trips are cheaper and more fun with a group. Join a SyncTrip trip plan, or post one and split the cab.",
    ],
    image: { src: "/city-guides/gurgaon-neemrana.jpg", alt: "Neemrana Fort-Palace lit up at dusk" },
    venuePages: ["treks-day-trips"],
    venueActivities: ["day_trip", "hike"],
    feed: { activities: ["trek", "hike", "day_trip", "camping", "riding"] },
    venuesTitle: "Easy escapes",
    tips: [
      { title: "Leave before 7", text: "Beating Delhi's traffic makes a half-day trip feel like a full one." },
      { title: "Split the ride", text: "Post the trip with the cost per seat. Four people in a cab costs less than the metro plus autos for one." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "What are the best places to visit near Delhi for a day?", answer: "Asola Bhatti Wildlife Sanctuary, Mangar Bani and Surajkund make easy half-day trips. For a full day, Neemrana Fort-Palace and Agra are popular drives." },
      { question: "Are there treks near Delhi?", answer: "Delhi's ridge has short trails at Asola Bhatti and Sanjay Van, and Mangar Bani in the Aravallis has forest hikes. For proper treks, head to the Himalayan foothills over a weekend." },
      { question: "How do I find people for a day trip?", answer: "Post the trip on SyncTrip with the date, plan and cost per seat, or join one someone already posted." },
    ],
    related: ["outdoors-running", "fun-activities", "events-this-weekend"],
  },
];

/* Noida. Keyword Planner (India, Oct 2026): cafes in noida 14.8k, trampoline park noida 12.1k,
   go karting noida 12.1k, clubs in noida 5.4k, best cafes in noida 5.4k, parks in noida 5.4k,
   bowling noida 3.6k, things to do in noida 2.9k, pickleball noida 1.9k.
   Venues: SyncTrip_SEO/noida/venues-seed-noida.json (cityName Noida). */
const NOIDA_ACTIVITIES: ActivityGuide[] = [
  {
    slug: "fun-activities",
    navLabel: "Trampoline, karting & bowling",
    icon: "Zap",
    accent: "#F3359E",
    seoTitle: "Go-Karting, Trampoline Parks & Bowling Noida",
    seoDescription:
      "Go-karting at Formula 11, trampoline parks, bowling and escape rooms in Noida, from Sector 18 to Greater Noida West, plus people to go with on SyncTrip.",
    keywords: [
      "go karting noida", "trampoline park noida", "bowling noida", "escape room noida",
      "game zone noida", "fun activities in noida", "fun places in noida",
    ],
    h1: "Go-karting, trampoline parks, bowling & escape rooms in Noida",
    kicker: "Group outings · Noida",
    intro: [
      "Noida has the NCR's biggest go-karting track: Formula 11 at Worlds of Wonder in Sector 38A. Around Sector 18, SkyJumper's trampoline park is at Wave Mall and The Game Palacio at DLF Mall of India has bowling, VR and trampolines; Timezone at Gaur City Mall serves Greater Noida West, and Mystery Rooms runs escape rooms at Spectrum Metro, Sector 75.",
      "All of these are better with 4–8 people. If your friends are busy, post a plan on SyncTrip and go with people in Noida who are up for the same thing.",
    ],
    image: { src: "/city-guides/activity-go-karting.jpg", alt: "Go-kart track", credit: CC.goKart },
    venuePages: ["fun-activities"],
    feed: { activities: ["bowling", "go_karting", "trampoline", "escape_room", "laser_tag"], outings: ["other", "mall"] },
    venuesTitle: "Where to go",
    tips: [
      { title: "Make karting a race", text: "Formula 11's 700-metre track is built for racing groups. Bring a full grid and time your laps." },
      { title: "Weekday evenings beat weekends", text: "Mall game zones are busiest on weekend afternoons. Weekday evenings mean shorter queues." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Where can I go go-karting in Noida?", answer: "Formula 11 Karting at Worlds of Wonder, Entertainment City, Sector 38A is one of India's biggest go-karting facilities, with a 700-metre, 11-turn track. It's near the Botanical Garden metro." },
      { question: "Which is the best trampoline park in Noida?", answer: "SkyJumper at Wave Mall, Sector 18 is the most central, and The Game Palacio at DLF Mall of India has trampolines alongside bowling and VR." },
      { question: "Where can I go bowling in Noida?", answer: "The Game Palacio at DLF Mall of India (Sector 18) and Timezone at Gaur City Mall (Greater Noida West) both have bowling lanes and arcades." },
      { question: "Is there an escape room in Noida?", answer: "Yes. Mystery Rooms runs themed escape rooms at Spectrum Metro in Sector 75; plan for a team of 4–6." },
      { question: "How do I find people to go with?", answer: "Post the activity as a plan on SyncTrip with a date and time, or join an open plan. People in Noida who want to do the same thing join, and you coordinate in the plan chat." },
    ],
    related: ["gaming-board-games", "nightlife", "turf-football-cricket"],
  },
  {
    slug: "cafes-to-meet-people",
    navLabel: "Cafés",
    icon: "Coffee",
    accent: "#B45309",
    seoTitle: "Best Cafés in Noida to Meet People",
    seoDescription:
      "The best cafés in Noida for meetups: Sector 18 near the malls and Sector 104 on the Expressway, picks that work for groups who've just met.",
    keywords: [
      "cafes in noida", "best cafes in noida", "hangout places in noida", "cafes in sector 18 noida",
      "cafes in sector 104 noida", "cafes to hang out with friends in noida",
    ],
    h1: "Cafés in Noida where you can actually meet people",
    kicker: "Cafés & meetups · Noida",
    intro: [
      "Noida's café scene has two hubs: Sector 18, next to the metro and DLF Mall of India (Blue Tokai, SOCIAL), and Sector 104 on the Expressway, where Barista Diner and Ndori serve the office and society crowd. These picks work for a group of people who have just met.",
      "Moved to Noida for work and still eating lunch alone? Join a SyncTrip café meetup and walk in knowing there's a table waiting for you.",
    ],
    image: { src: "/city-guides/activity-cafe-friends.jpg", alt: "Coffee on a café table", credit: CC.cafe },
    venuePages: ["cafes-to-meet-people"],
    venueActivities: ["cafe"],
    feed: { activities: ["board_games", "community_space", "mafia"], outings: ["cafe"] },
    venuesTitle: "Cafés that work for meetups",
    tips: [
      { title: "Sector 18 for weekends", text: "It's on the Blue Line, so people from across Noida and East Delhi can get there easily." },
      { title: "Sector 104 for weeknights", text: "Close to the Expressway offices, so after-work meetups get more yeses." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which are the best cafés in Noida to hang out with friends?", answer: "SOCIAL at DLF Mall of India for big groups, Blue Tokai in Sector 18 for a calm coffee, and Barista Diner and Ndori in Sector 104 for evening catch-ups." },
      { question: "How do I make friends in Noida?", answer: "Do things together rather than just chat: join a SyncTrip café meetup, a pickleball game in Sector 73, a turf game on the Expressway or a pottery workshop. Many people come alone." },
      { question: "Are SyncTrip café meetups free?", answer: "Open plans posted by members are free to join; you pay for your own food and drinks. Club events may have a ticket, shown on the event." },
    ],
    related: ["nightlife", "events-this-weekend", "gaming-board-games"],
  },
  {
    slug: "nightlife",
    navLabel: "Clubs & nightlife",
    icon: "Music",
    accent: "#7C3AED",
    seoTitle: "Clubs in Noida: Nightlife, Pubs & Bars",
    seoDescription:
      "Clubs and pubs in Noida: Gardens Galleria in Sector 38A, DLF Mall of India and Sector 104, from DJ nights to live music, plus a group to go with.",
    keywords: [
      "clubs in noida", "pubs in noida", "bars in noida", "nightlife in noida",
      "gardens galleria clubs", "pubs in sector 18 noida",
    ],
    h1: "Clubs, pubs and nightlife in Noida",
    kicker: "Nights out · Noida",
    intro: [
      "Most of Noida's nightlife is in one building: Gardens Galleria in Sector 38A, home to Time Machine, LIT Ultrabar and Imperfecto Ruin Pub. Across the road, DLF Mall of India has The Irish House and SOCIAL, and Sector 104 has live-music spots like At Live.",
      "A night out works best with a group. If yours is busy, find people going out the same night on SyncTrip.",
    ],
    image: { src: "/city-guides/chandigarh-nightlife.jpg", alt: "Crowd at a club night" },
    venuePages: ["nightlife"],
    venueActivities: ["nightlife", "live_music"],
    feed: { activities: ["music", "karaoke", "party"], outings: ["nightlife"] },
    venuesTitle: "Clubs, pubs & bars",
    tips: [
      { title: "Gardens Galleria is the hub", text: "With several clubs and pubs in one mall, it's easy to move between venues if one is too packed." },
      { title: "Take the metro home", text: "Gardens Galleria and Mall of India are near the Botanical Garden and Sector 18 metro stations. Check the last train time." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which are the best clubs in Noida?", answer: "Time Machine and LIT Ultrabar at Gardens Galleria are Noida's best-known clubs. For pubs, try Imperfecto Ruin Pub (Gardens Galleria) or The Irish House (DLF Mall of India)." },
      { question: "Where is the nightlife in Noida?", answer: "Gardens Galleria in Sector 38A, DLF Mall of India in Sector 18, and Sector 104 on the Expressway." },
      { question: "Are there live-music bars in Noida?", answer: "Yes. Imperfecto Ruin Pub hosts live music, The Irish House has live performances, and At Live in Sector 104 has gigs most evenings." },
    ],
    related: ["cafes-to-meet-people", "events-this-weekend", "fun-activities"],
  },
  {
    slug: "gaming-board-games",
    navLabel: "Board games & gaming",
    icon: "Gamepad2",
    accent: "#2785E7",
    seoTitle: "Gaming Cafés & Board Game Nights in Noida",
    seoDescription:
      "Gaming cafés in Noida with PS5 and gaming PCs, from Sector 18 to Sector 104, plus board-game nights on SyncTrip. Find a squad near you.",
    keywords: [
      "gaming cafe noida", "board game cafe noida", "ps5 gaming cafe noida", "gaming zone noida", "board games noida",
    ],
    h1: "Gaming cafés and board-game nights in Noida",
    kicker: "Games nights · Noida",
    intro: [
      "Noida's gaming cafés follow its offices and colleges: Ground Zero Esports in Sector 18, Noobz Gaming Arena in the Sector 62–63 student and IT corridor, and GG Arena in Sector 104. The Game Palacio at DLF Mall of India adds bowling, VR and arcade games.",
      "Board-game cafés are rare in Noida, so the best board-game nights are the ones people organise. Join one on SyncTrip, or post your own.",
    ],
    image: { src: "/city-guides/chandigarh-gaming-theory.jpg", alt: "PS5 gaming stations in a gaming lounge", credit: { author: "The Gaming Theory", license: "venue photo", url: "https://www.thegamingtheory.com/" } },
    venuePages: ["gaming-board-games"],
    venueActivities: ["board_games", "gaming", "vr"],
    feed: { activities: ["board_games", "mafia", "gaming", "anime", "community_space"], outings: ["cafe"] },
    venuesTitle: "Gaming cafés & arenas",
    tips: [
      { title: "Book consoles ahead", text: "PS5 stations are limited in most cafés, so call ahead for a group console session." },
      { title: "Bring the board games", text: "Cafés are happy to host a board-game night on a quiet weekday. Post it on SyncTrip and bring the games." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which is the best gaming café in Noida?", answer: "Ground Zero Esports in Sector 18, Noobz Gaming Arena in Sector 63 and GG Arena in Sector 104 are well-rated, with gaming PCs and PS5 stations." },
      { question: "Is there a board game café in Noida?", answer: "Dedicated board-game cafés are rare in Noida. SyncTrip members run board-game nights at cafés; join one or post your own." },
      { question: "How do I find people to game with in Noida?", answer: "Post a gaming plan on SyncTrip with the café and time, and players nearby join to fill your squad." },
    ],
    related: ["fun-activities", "cafes-to-meet-people", "events-this-weekend"],
  },
  {
    slug: "pickleball-badminton",
    navLabel: "Pickleball & badminton",
    icon: "Activity",
    accent: "#059669",
    seoTitle: "Pickleball & Badminton Courts in Noida",
    seoDescription:
      "Pickleball and badminton courts in Noida: Sector 73, Sector 44, Noida Stadium, Sector 50 and Sector 11, plus doubles partners on SyncTrip.",
    keywords: [
      "pickleball noida", "pickleball court noida", "badminton court noida", "badminton academy noida", "padel noida",
    ],
    h1: "Pickleball and badminton courts in Noida",
    kicker: "Racquet sports · Noida",
    intro: [
      "Noida's courts are spread across the city: PlayAll in Sector 73 and at Modern School in Sector 11, Arena 44 at the Mahamaya sports complex, indoor courts at Indrayu Jeta Sports in Sector 50, and Rackonnect's badminton arena in the Noida Stadium indoor hall.",
      "Doubles needs four people. Post a game on SyncTrip with your court and time, and players nearby fill the spots.",
    ],
    image: { src: "/city-guides/activity-pickleball.jpg", alt: "Pickleball doubles match", credit: CC.pickleball },
    venuePages: ["pickleball-badminton"],
    venueActivities: ["pickleball", "badminton", "padel"],
    feed: { activities: ["badminton", "pickleball", "tennis"], sports: ["badminton", "pickleball", "tennis"] },
    venuesTitle: "Courts",
    tips: [
      { title: "Indoor courts for summer", text: "Indrayu Jeta Sports and the Noida Stadium hall are indoors, which beats the afternoon heat." },
      { title: "New to pickleball?", text: "It's quick to learn. Join a beginners' plan on SyncTrip and you'll be rallying in your first hour." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Where can I play pickleball in Noida?", answer: "PlayAll in Sector 73 and at Modern School (Sector 11), Arena 44 in Sector 44 and Indrayu Jeta Sports in Sector 50 all have pickleball courts." },
      { question: "Where can I play badminton in Noida?", answer: "Rackonnect's arena in the Noida Stadium indoor hall (Sector 21A), Arena 44 and PlayAll Sector 73 have badminton courts." },
      { question: "How do I find a doubles partner in Noida?", answer: "Post a pickleball or badminton plan on SyncTrip with the court and time. Players nearby join, and you can keep playing with the ones you click with." },
    ],
    related: ["turf-football-cricket", "outdoors-running", "fun-activities"],
  },
  {
    slug: "turf-football-cricket",
    navLabel: "Turf & box cricket",
    icon: "Trophy",
    accent: "#16A34A",
    seoTitle: "Box Cricket & Football Turfs in Noida",
    seoDescription:
      "Box cricket and football turfs in Noida: Sector 62, the Expressway (93B, 101, 119), Sector 73 and Sector 44, plus players to fill your team on SyncTrip.",
    keywords: [
      "box cricket noida", "turf noida", "football turf noida", "cricket turf noida", "box cricket near me",
    ],
    h1: "Box cricket and football turfs in Noida",
    kicker: "Turf games · Noida",
    intro: [
      "The Noida Expressway is the city's turf belt: CoPlay in Sector 93B, Arenamate in Sector 101 and Turf Enough in Sector 119. In central Noida, The Box Cage in Sector 62, PlayAll in Sector 73 and Arena 44 in Sector 44 all run box cricket and football, most with floodlights.",
      "Getting a full side on the same night is the hard part. Post the slot on SyncTrip and players nearby fill it.",
    ],
    image: { src: "/city-guides/chandigarh-box-cricket.jpg", alt: "Floodlit box cricket turf at night" },
    venuePages: ["turf-football-cricket"],
    venueActivities: ["football", "futsal", "box_cricket", "cricket"],
    feed: { activities: ["football", "cricket", "box_cricket"], sports: ["football", "cricket"] },
    venuesTitle: "Turfs & arenas",
    tips: [
      { title: "Late games are easy to book", text: "Several Expressway turfs run round the clock, so a 10 pm game is easier to fill than a 7 pm one." },
      { title: "Split the turf fee", text: "Post the game with the per-person cost so people know up front." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Where can I play box cricket in Noida?", answer: "The Box Cage (Sector 62), CoPlay (Sector 93B), Arenamate (Sector 101), Turf Enough (Sector 119), PlayAll (Sector 73) and Arena 44 (Sector 44) all have box cricket." },
      { question: "Where is the best football turf in Noida?", answer: "CoPlay in Sector 93B has a FIFA-approved 7-a-side turf, and Turf Enough in Sector 119 is one of the most reviewed." },
      { question: "How do I find players for a turf game?", answer: "Post the game on SyncTrip with the turf, time and cost per person. People nearby join until the side is full." },
    ],
    related: ["pickleball-badminton", "fun-activities", "outdoors-running"],
  },
  {
    slug: "events-this-weekend",
    navLabel: "Events this weekend",
    icon: "CalendarDays",
    accent: "#DC2626",
    seoTitle: "Events in Noida This Weekend: Comedy & Gigs",
    seoDescription:
      "Events in Noida this weekend: stand-up comedy, live music and SyncTrip club events in Sector 104, Gardens Galleria and beyond, plus people to go with.",
    keywords: [
      "events in noida", "events in noida this weekend", "comedy show noida", "concerts in noida", "live music noida",
    ],
    h1: "Events in Noida this weekend: comedy, gigs and club nights",
    kicker: "What's on · Noida",
    intro: [
      "Sector 104 is Noida's comedy and live-music strip: Comedy County and At Live near Starling Edge Mall, and stand-up nights at Hitchin in Hajipur. Imperfecto Ruin Pub at Gardens Galleria has live bands too. Below are SyncTrip club events and open plans this week.",
      "A comedy night or gig is more fun with people. Join a plan, or post one for the show you want to see.",
    ],
    image: { src: "/home/meetup-reel-poster.webp", alt: "A SyncTrip board-game night: a full table of new friends" },
    venuePages: ["events-this-weekend"],
    venueActivities: ["comedy", "theatre", "exhibitions", "concerts"],
    feed: { outings: ["cafe", "nightlife", "mall", "other"], sports: ["badminton", "pickleball", "football", "cricket", "tennis"] },
    venuesTitle: "Where Noida's shows & gigs happen",
    tips: [
      { title: "Surprise line-ups", text: "Many Noida comedy nights have surprise line-ups, so they're cheap and fun with a group." },
      { title: "Make a night of it", text: "Pair a Sector 104 comedy show with dinner nearby, or a gig at Gardens Galleria with a drink after." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "What are the best events in Noida this weekend?", answer: "Check stand-up at Comedy County and Hitchin in Sector 104, live music at At Live and Imperfecto Ruin Pub, and the SyncTrip club events and open plans on this page." },
      { question: "Where can I watch stand-up comedy in Noida?", answer: "Comedy County near Starling Edge Mall and Hitchin in Hajipur, both in Sector 104, run regular comedy nights." },
      { question: "Where can I find people to go to events with?", answer: "Join an open plan on SyncTrip or post one for the event you want to see." },
    ],
    related: ["nightlife", "cafes-to-meet-people", "workshops"],
  },
  {
    slug: "workshops",
    navLabel: "Pottery & workshops",
    icon: "Palette",
    accent: "#EA580C",
    seoTitle: "Pottery Classes & Workshops in Noida",
    seoDescription:
      "Pottery classes and workshops in Noida for beginners: studios in Sectors 21, 41, 56 and 122, plus a group to go with on SyncTrip.",
    keywords: [
      "pottery class noida", "pottery workshop noida", "workshops in noida", "art workshop noida", "weekend workshops noida",
    ],
    h1: "Pottery classes and creative workshops in Noida",
    kicker: "Workshops · Noida",
    intro: [
      "Noida has a good spread of pottery studios: Smug Mug near Noida Stadium and the rooftop Claying Thoughts in Sector 21, Aakaar Studio in Sector 41, Studio Nendo in Sector 56 and KumHar in Sector 122. Most run one-off beginner sessions as well as longer courses.",
      "A workshop is one of the easiest ways to meet people. Book one with a SyncTrip group.",
    ],
    image: { src: "/city-guides/workshops-pottery.jpg", alt: "Handmade glazed pottery from a beginners' workshop" },
    venuePages: ["workshops"],
    venueActivities: ["pottery", "art", "exhibitions"],
    feed: { activities: ["pottery", "art", "workshop", "dance", "music"] },
    venuesTitle: "Studios & venues",
    tips: [
      { title: "Start with a single session", text: "Try a one-day workshop before signing up for a course." },
      { title: "Weekdays are quieter", text: "Several studios close on Sundays and get busy on Saturdays, so weekday sessions are easier to book for a group." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Where can I take a pottery class in Noida?", answer: "Smug Mug and Claying Thoughts in Sector 21, Aakaar Studio in Sector 41, Studio Nendo in Sector 56 and KumHar Pottery Studio in Sector 122 all teach beginners." },
      { question: "Do I need experience for a pottery workshop?", answer: "No. Beginner sessions cover the basics of hand-building and the wheel." },
      { question: "Can I go to a workshop alone?", answer: "Yes. Joining a SyncTrip plan means you'll already know a few people at the table." },
    ],
    related: ["events-this-weekend", "cafes-to-meet-people", "outdoors-running"],
  },
  {
    slug: "outdoors-running",
    navLabel: "Parks, runs & walks",
    icon: "Footprints",
    accent: "#0891B2",
    seoTitle: "Best Parks in Noida for Runs & Walks",
    seoDescription:
      "The best parks in Noida for running and walks: Okhla Bird Sanctuary, the Botanical Garden and Noida Stadium, plus running groups and walking buddies.",
    keywords: [
      "parks in noida", "best parks in noida", "okhla bird sanctuary", "noida botanical garden",
      "running club noida", "places to walk in noida",
    ],
    h1: "The best parks in Noida for runs, walks and weekend mornings",
    kicker: "Outdoors · Noida",
    intro: [
      "Okhla Bird Sanctuary on the Yamuna has Noida's best nature trails, especially in winter when the migratory birds arrive. The Botanical Garden in Sector 38A has shaded paths next to the metro, and Noida Stadium in Sector 21A is where the city's running groups train.",
      "Mornings are easier with company. Join a SyncTrip run or walk and meet people who show up every week.",
    ],
    image: { src: "/city-guides/noida-okhla-bird-sanctuary.jpg", alt: "A tree-lined trail at Okhla Bird Sanctuary, Noida", credit: CC_NCR.okhla },
    venuePages: ["outdoors-running"],
    venueActivities: ["running", "cycling", "walks"],
    feed: { activities: ["running", "cycling", "walk", "yoga"] },
    venuesTitle: "Where to run & walk",
    tips: [
      { title: "Winter mornings at Okhla", text: "November to February is the best time for birdwatching walks at Okhla." },
      { title: "Check the air", text: "On high-AQI days, swap the run for an indoor plan like pickleball or a gaming night." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "Which are the best parks in Noida?", answer: "Okhla Bird Sanctuary for nature walks, the Botanical Garden in Sector 38A for shaded morning walks, and Noida Stadium in Sector 21A for running." },
      { question: "Are there running groups in Noida?", answer: "Yes. Groups train at Noida Stadium and run in the city's big parks. On SyncTrip you can join a group run or post your own." },
      { question: "When is the best time to visit Okhla Bird Sanctuary?", answer: "Winter, from November to February, when migratory birds arrive. Go early in the morning." },
    ],
    related: ["pickleball-badminton", "treks-day-trips", "workshops"],
  },
  {
    slug: "treks-day-trips",
    navLabel: "Day trips",
    icon: "Mountain",
    accent: "#4D7C0F",
    seoTitle: "Places to Visit Near Noida: Day Trips",
    seoDescription:
      "Places to visit near Noida for a day or a weekend: Agra down the Yamuna Expressway, Neemrana, Jaipur and the hills, plus a group to go with on SyncTrip.",
    keywords: [
      "places to visit near noida", "weekend getaways from noida", "one day trip from noida", "day trips from noida",
    ],
    h1: "Places to visit near Noida: day trips and weekend getaways",
    kicker: "Day trips · Noida",
    intro: [
      "Noida sits at the start of the Yamuna Expressway, which makes Agra one of the easiest day trips in the NCR. For a long weekend, Jaipur, Rishikesh and the Uttarakhand hills are a drive or an overnight bus away.",
      "Trips are cheaper and more fun with a group. Join a SyncTrip trip plan, or post one and split the ride.",
    ],
    image: { src: "/city-guides/gurgaon-neemrana.jpg", alt: "Neemrana Fort-Palace lit up at dusk" },
    venuePages: ["treks-day-trips"],
    venueActivities: ["day_trip", "hike"],
    feed: { activities: ["trek", "hike", "day_trip", "camping", "riding"] },
    venuesTitle: "Easy escapes",
    tips: [
      { title: "Use the Expressway", text: "Leave early on the Yamuna Expressway and you can be in Agra for breakfast." },
      { title: "Split the ride", text: "Post the trip with the cost per seat, and four people in one car makes it cheap." },
      HOW_SYNCTRIP_WORKS,
    ],
    faqs: [
      { question: "What are the best places to visit near Noida?", answer: "Agra is the easiest day trip, down the Yamuna Expressway. For weekends, Jaipur, Rishikesh, Mussoorie and Jim Corbett are popular." },
      { question: "How do I find people for a trip from Noida?", answer: "Post the trip on SyncTrip with the date, plan and cost per seat, or join one someone already posted." },
    ],
    related: ["outdoors-running", "fun-activities", "events-this-weekend"],
  },
];

const NCR_GETAWAYS = [
  { name: "Agra", slug: "things-to-do-in-agra-uttar-pradesh", distance: "~3 hrs", note: "Yamuna Expressway, doable in a day." },
  { name: "Neemrana", slug: "things-to-do-in-neemrana-rajasthan", distance: "~2.5 hrs", note: "Fort palace day trip down NH-48." },
  { name: "Jaipur", slug: "things-to-do-in-jaipur-rajasthan", distance: "~5 hrs", note: "The standard NCR long weekend." },
  { name: "Rishikesh", slug: "things-to-do-in-rishikesh-uttarakhand", distance: "~6 hrs", note: "Rafting, camps and river cafés." },
  { name: "Jim Corbett", slug: "things-to-do-in-jim-corbett-national-park-uttarakhand", distance: "~6 hrs", note: "Safari weekends from NCR." },
  { name: "Lansdowne", slug: "things-to-do-in-lansdowne-uttarakhand", distance: "~6 hrs", note: "Quiet cantonment hill town." },
  { name: "Mussoorie", slug: "things-to-do-in-mussoorie-uttarakhand", distance: "~7 hrs", note: "Hills without the Himachal drive." },
  { name: "Shimla", slug: "things-to-do-in-shimla-himachal-pradesh", distance: "~8 hrs", note: "Overnight bus or an early start." },
];

const DELHI_GUIDE: CityGuide = {
  citySlug: "delhi",
  cityName: "Delhi",
  state: "National Capital Territory · Delhi",
  geo: { lat: 28.6139, lng: 77.209 },
  seoTitle: "Things to Do in Delhi & Make Friends",
  seoDescription:
    "Things to do in Delhi with people: trampoline parks, bowling, clubs, cafés, pickleball, turf games, parks and day trips, plus a crew to go with.",
  keywords: [
    "things to do in delhi", "fun places in delhi", "things to do in delhi with friends", "make friends in delhi",
    "meetups in delhi", "places to hang out in delhi", "weekend plans in delhi",
  ],
  h1: "Things to do in Delhi, and people to do them with",
  kicker: "Delhi · New Delhi",
  intro: [
    "Delhi has everything except time: the city is so big that your college friends live an hour away and your office friends clock out in the other direction. Finding people free for the same plan, on the same night, near you, is the hard part.",
    "That's what SyncTrip is for. Pick what you feel like doing below, see what's happening this week, and join a plan or start your own.",
  ],
  image: { src: "/city-guides/delhi-india-gate.jpg", alt: "India Gate, New Delhi, against a blue sky", credit: CC_NCR.indiaGate },
  areasTitle: "Across Delhi",
  areasSub: "Plans are pinned to where they happen, so a Dwarka turf game doesn't show up as a 7pm option for someone in Laxmi Nagar.",
  placesSub: "From Hauz Khas and Connaught Place to Dwarka, Rohini and East Delhi.",
  areas: [
    { name: "South Delhi", note: "Hauz Khas Village bars and cafés, Shahpur Jat, Saket's courts, Malviya Nagar gaming and pottery studios." },
    { name: "Central Delhi & CP", note: "Connaught Place clubs and coffee houses, Akshara Theatre, Lodhi Garden and Sunder Nursery." },
    { name: "West Delhi & Dwarka", note: "Rajouri Garden and Tagore Garden malls, Dwarka's turfs and Timezone, Aerocity's late-night clubs." },
    { name: "North Delhi", note: "Rohini's SkyJumper and turfs, Pitampura and the North Campus crowd." },
    { name: "East Delhi", note: "Laxmi Nagar and Preet Vihar gaming cafés, close to Noida's Sector 18." },
  ],
  getaways: NCR_GETAWAYS,
  faqs: [
    { question: "How can I make friends in Delhi?", answer: "Do things with people rather than just chat: join a SyncTrip café meetup in Hauz Khas, a morning run in Lodhi Garden, a pickleball game in Saket or a turf game in Dwarka. Many people come alone, so it's normal to show up without a group." },
    { question: "What are the best things to do in Delhi with friends?", answer: "Trampolines at SkyJumper Rohini, bowling at Timezone or SMAAASH, an escape room in Connaught Place, jazz at The Piano Man, a night out in Hauz Khas Village, pickleball in Saket, or a day trip to Surajkund or Neemrana." },
    { question: "What can I do in Delhi at night?", answer: "Clubs in Connaught Place and Aerocity, bars and live music in Hauz Khas Village, jazz at The Piano Man, comedy at The Laugh Store, or a late turf game in Dwarka." },
    { question: "Is SyncTrip free?", answer: "Joining and creating plans on SyncTrip is free. Some club events have a ticket price shown on the event." },
  ],
  activities: DELHI_ACTIVITIES,
};

const NOIDA_GUIDE: CityGuide = {
  citySlug: "noida",
  cityName: "Noida",
  state: "Gautam Buddh Nagar · Uttar Pradesh",
  geo: { lat: 28.5355, lng: 77.391 },
  seoTitle: "Things to Do in Noida & Make Friends",
  seoDescription:
    "Things to do in Noida with people: go-karting, trampoline parks, clubs, cafés, pickleball, turf games and parks, plus a crew to go with on SyncTrip.",
  keywords: [
    "things to do in noida", "fun places in noida", "things to do in noida with friends", "make friends in noida",
    "places to hang out in noida", "weekend plans in noida",
  ],
  h1: "Things to do in Noida, and people to do them with",
  kicker: "Noida · Uttar Pradesh",
  intro: [
    "Noida is full of people who moved for work, live in a society off the Expressway, and spend weekends wondering where everyone is. The plans are here (the karting track, the turf, the Friday gig); the people to do them with are harder to find.",
    "That's what SyncTrip is for. Pick what you feel like doing below, see what's happening this week, and join a plan or start your own.",
  ],
  image: { src: "/city-guides/noida-skyline.jpg", alt: "View over Noida city and the Yamuna from the Hilton", credit: CC_NCR.noidaSkyline },
  areasTitle: "Across Noida",
  areasSub: "Plans are pinned to where they happen, so a Sector 119 turf game doesn't show up as a 7pm option for someone in Greater Noida West.",
  placesSub: "From Sector 18 and Gardens Galleria to the Expressway and Greater Noida West.",
  areas: [
    { name: "Sector 18 & Mall of India", note: "DLF Mall of India, Wave Mall's SkyJumper, cafés and pubs by the Blue Line metro." },
    { name: "Sector 38 & Gardens Galleria", note: "Gardens Galleria's clubs, Formula 11 karting at Worlds of Wonder, the Botanical Garden." },
    { name: "Sectors 21–76", note: "Noida Stadium, pottery studios, the Sector 62–63 IT and student hub, PlayAll and Spectrum Metro." },
    { name: "Noida Expressway", note: "Sector 104's comedy and live music, and the turf belt from Sector 93 to 137." },
    { name: "Greater Noida West", note: "Gaur City Mall's Timezone and the newest society neighbourhoods." },
  ],
  getaways: NCR_GETAWAYS,
  faqs: [
    { question: "How can I make friends in Noida?", answer: "Do things with people rather than just chat: join a SyncTrip café meetup in Sector 18, a pickleball game in Sector 73, a turf game on the Expressway or a pottery workshop. Many people come alone." },
    { question: "What are the best things to do in Noida with friends?", answer: "Go-karting at Formula 11, trampolines at SkyJumper, bowling at The Game Palacio, an escape room at Spectrum Metro, a night at Gardens Galleria, comedy in Sector 104, or a winter walk at Okhla Bird Sanctuary." },
    { question: "What can I do in Noida at night?", answer: "Clubs at Gardens Galleria, pubs at DLF Mall of India, live music and comedy in Sector 104, or a late turf game on the Expressway." },
    { question: "Is SyncTrip free?", answer: "Joining and creating plans on SyncTrip is free. Some club events have a ticket price shown on the event." },
  ],
  activities: NOIDA_ACTIVITIES,
};

export const CITY_GUIDES: CityGuide[] = [
  {
    citySlug: "chandigarh",
    cityName: "Chandigarh",
    state: "Chandigarh · Mohali · Panchkula · Zirakpur",
    geo: { lat: 30.7333, lng: 76.7794 },
    seoTitle: "Things to Do in Chandigarh with People",
    seoDescription:
      "Things to do in Chandigarh, Mohali, Zirakpur & Panchkula: go-karting, cafés, nightlife, pickleball, board-game nights, treks, and people to go with.",
    keywords: [
      "things to do in chandigarh", "things to do in chd", "fun activities in chandigarh", "places to visit in chandigarh with friends",
      "things to do in mohali", "things to do in panchkula", "things to do in zirakpur", "make friends in chandigarh",
    ],
    h1: "Things to do in Chandigarh, and people to do them with",
    kicker: "Chandigarh tricity",
    intro: [
      "Go-karting in Zirakpur, a board-game night in Sector 26, pickleball by Sukhna Lake, a club night at IT Park or a trek to Tikkar Taal: the tricity has plenty to do. The hard part is usually finding people who are free and up for it.",
      "That's what SyncTrip is for. Pick what you want to do below, see what's happening this week, and join a plan or start your own.",
    ],
    image: cityImage("chandigarh")!,
    areasTitle: "Across the tricity",
    areasSub: "Chandigarh, Mohali, Zirakpur and Panchkula are one city for plans: most places are within 30 minutes of each other.",
    placesSub: "Across Chandigarh, Mohali, Zirakpur and Panchkula.",
    areas: [
      { name: "Chandigarh", note: "Sectors 7, 10, 17, 22, 26 and 35 for cafés, nightlife and meetups; Sector 1 for Sukhna and pickleball." },
      { name: "Mohali", note: "Turfs, box cricket, gaming lounges and courts across Sectors 62–69 and Kharar." },
      { name: "Zirakpur", note: "Trampoline parks, go-karting and rooftop turfs along the Ambala–Chandigarh Expressway." },
      { name: "Panchkula", note: "Pickleball in Sector 16 and the road up to Morni Hills." },
    ],
    getaways: [
      { name: "Parwanoo", slug: "things-to-do-in-parwanoo-himachal-pradesh", distance: "~1 hr", note: "Timber Trail cable car and hike." },
      { name: "Kasauli", slug: "things-to-do-in-kasauli-himachal-pradesh", distance: "~1.5–2 hrs", note: "Pine forests and sunset points." },
      { name: "Shimla", slug: "things-to-do-in-shimla-himachal-pradesh", distance: "~3.5 hrs", note: "The classic weekend escape." },
      { name: "Amritsar", slug: "things-to-do-in-amritsar-punjab", distance: "~4 hrs", note: "Golden Temple and food trail." },
      { name: "Narkanda", slug: "things-to-do-in-narkanda-himachal-pradesh", distance: "~5 hrs", note: "Apple orchards and winter snow." },
      { name: "Rishikesh", slug: "things-to-do-in-rishikesh-uttarakhand", distance: "~5 hrs", note: "Rafting, cafés and the Ganga." },
      { name: "Dharamshala", slug: "things-to-do-in-dharamshala-himachal-pradesh", distance: "~6 hrs", note: "Triund trek and McLeod Ganj." },
      { name: "Manali", slug: "things-to-do-in-manali-himachal-pradesh", distance: "~8–9 hrs", note: "Long weekends and road trips." },
    ],
    faqs: [
      { question: "What are the best things to do in Chandigarh with friends?", answer: "Go-karting or trampolines in Zirakpur, bowling at Elante, an escape room in Sector 35, a board-game night at a Sector 26 café, pickleball near Sukhna Lake, a night out in Sector 26 or IT Park, or a day trek to Tikkar Taal in Morni Hills." },
      { question: "How can I make friends in Chandigarh?", answer: "Do things with people rather than just chat: join a SyncTrip board-game night, a Sukhna run with Oye Runner, a badminton or pickleball plan, or a café meetup. Many people come alone, so it's normal to show up without a group." },
      { question: "What can I do in Chandigarh at night?", answer: "Pubs and breweries along Madhya Marg (Sector 26), live music and clubs around Elante and Industrial Area Phase I, Kitty Su at The Lalit on weekends, bowling at The Game Palacio till midnight, or a late turf game in Mohali." },
      { question: "Is SyncTrip free?", answer: "Joining and creating plans on SyncTrip is free. Some club events, like board-game nights, have a ticket price shown on the event." },
    ],
    activities: CHANDIGARH_ACTIVITIES,
  },
  {
    citySlug: "gurgaon",
    cityName: "Gurgaon",
    state: "Gurugram · Haryana",
    geo: { lat: 28.4595, lng: 77.0266 },
    seoTitle: "Things to Do in Gurgaon & Make Friends",
    seoDescription:
      "Things to do in Gurgaon with people: trampoline parks, go-karting, clubs, cafés, board-game nights, pickleball and day trips, plus a crew to go with.",
    keywords: [
      "things to do in gurgaon", "make friends in gurgaon", "fun activities in gurgaon", "things to do in gurgaon with friends",
      "weekend plans in gurgaon", "places to hangout in gurgaon", "meetups in gurgaon", "gurugram social groups",
    ],
    h1: "Things to do in Gurgaon, and people to do them with",
    kicker: "Gurgaon · Gurugram",
    intro: [
      "Gurgaon is full of people who moved here for work and never quite built a circle. The weekends are long, and the group you actually want (the Friday turf slot, the game night, the people who'll drive to Damdama for breakfast) is the hardest thing to find.",
      "That's what SyncTrip is for. Pick what you feel like doing below, see what's happening this week, and join a plan or start your own.",
    ],
    image: cityImage("gurgaon")!,
    areasTitle: "Across Gurgaon",
    areasSub: "Plans are pinned to where they happen, so a Sohna Road game doesn't show up as a 7pm option for someone in Cyber City.",
    placesSub: "From Cyber City and Golf Course Road to Sohna Road and New Gurgaon.",
    areas: [
      { name: "Cyber City & DLF", note: "Cyber Hub, Ambience Mall and Galleria: after-work pubs, cafés, bowling and the Aravali Biodiversity Park trails." },
      { name: "Golf Course Road", note: "Escape rooms, board-game cafés, comedy and the Global Foyer and Central Plaza malls." },
      { name: "Sohna Road & Golf Course Ext", note: "Trampoline parks, go-karting in Balola, SMAAASH and Gurgaon's newest courts." },
      { name: "Old Gurgaon & Sector 29", note: "Sector 29's bars, Leisure Valley, 32nd Avenue and Epicentre's events." },
      { name: "New Gurgaon", note: "Sectors 81–95 along the Dwarka Expressway; Trumpy for trampolines." },
    ],
    getaways: [
      { name: "Neemrana", slug: "things-to-do-in-neemrana-rajasthan", distance: "~2 hrs", note: "Fort palace day trip down NH-48." },
      { name: "Alwar & Siliserh", slug: "things-to-do-in-alwar-rajasthan", distance: "~3 hrs", note: "Lake, forts and the Sariska road." },
      { name: "Agra", slug: "things-to-do-in-agra-uttar-pradesh", distance: "~3 hrs", note: "Yamuna Expressway, doable in a day." },
      { name: "Jaipur", slug: "things-to-do-in-jaipur-rajasthan", distance: "~4 hrs", note: "The standard NCR long weekend." },
      { name: "Rishikesh", slug: "things-to-do-in-rishikesh-uttarakhand", distance: "~6 hrs", note: "Rafting, camps and river cafés." },
      { name: "Jim Corbett", slug: "things-to-do-in-jim-corbett-national-park-uttarakhand", distance: "~6 hrs", note: "Safari weekends from NCR." },
      { name: "Mussoorie", slug: "things-to-do-in-mussoorie-uttarakhand", distance: "~7 hrs", note: "Hills without the Himachal drive." },
      { name: "Shimla", slug: "things-to-do-in-shimla-himachal-pradesh", distance: "~8 hrs", note: "Overnight bus or an early start." },
    ],
    faqs: [
      { question: "How can I make friends in Gurgaon?", answer: "Do things with people rather than just chat: join a SyncTrip board-game night, a run in Aravali Biodiversity Park, a turf or pickleball game, or a café meetup at Cyber Hub. Many people come alone, so it's normal to show up without a group." },
      { question: "What are the best things to do in Gurgaon with friends?", answer: "Trampoline parks on Sohna Road, go-karting in Balola, bowling at Ambience Mall or Cyber Hub, an escape room on Golf Course Road, a board-game café in Sector 51, a night out at Cyber Hub or Sector 29, or a breakfast ride to Damdama Lake." },
      { question: "What can I do in Gurgaon at night?", answer: "Cyber Hub's pubs and live music, Sector 29's bars and clubs, breweries in the Golf Course Road malls, late bowling at SMAAASH or a late turf game." },
      { question: "Is SyncTrip free?", answer: "Joining and creating plans on SyncTrip is free. Some club events, like board-game nights, have a ticket price shown on the event." },
    ],
    activities: GURGAON_ACTIVITIES,
  },
  DELHI_GUIDE,
  NOIDA_GUIDE,
];

export const getCityGuide = (citySlug: string) => CITY_GUIDES.find((g) => g.citySlug === citySlug) || null;

export const getActivityGuide = (citySlug: string, activitySlug: string) => {
  const city = getCityGuide(citySlug);
  const activity = city?.activities.find((a) => a.slug === activitySlug) || null;
  return city && activity ? { city, activity } : null;
};
