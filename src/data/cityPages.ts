/**
 * City landing pages — the Delhi NCR launch cluster.
 *
 * These target SOCIAL intent ("make friends in gurgaon", "weekend plans",
 * "riders club near me", "turf partners"), which is deliberately different from
 * the /location/* pages that target TRAVEL intent ("things to do in <place>",
 * "places to visit"). Keeping the two clusters apart is what stops them
 * cannibalising each other in the SERP.
 *
 * Every locality, route and venue named here is a real, checkable place. No
 * invented member counts, no invented ratings — a page that lies about how many
 * people are on it converts once and never again.
 */

export type CityFaq = { question: string; answer: string };

export type CityActivity = {
  id: string;
  icon: string;
  title: string;
  blurb: string;
  /** Real, locally-known spots. These carry the long-tail keywords. */
  spots: string[];
};

export type CityGetaway = {
  name: string;
  /** Slug of the matching /location page, so this becomes a real internal link. */
  slug: string;
  distance: string;
  note: string;
};

export type CityPage = {
  slug: string;
  name: string;
  /** Official name where it differs — both spellings get searched. */
  altName?: string;
  state: string;
  geo: { lat: number; lng: number };
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  h1: string;
  intro: string[];
  activities: CityActivity[];
  /** Neighbourhood names — the "<activity> in <locality>" long tail. */
  localities: string[];
  localitiesNote: string;
  clubsNote: string;
  getaways: CityGetaway[];
  /** Related reading on our own blog — internal links out of this page. */
  reads: { title: string; slug: string }[];
  faqs: CityFaq[];
  /** Other city pages, for lateral internal linking. */
  nearby: string[];
};

const GURGAON: CityPage = {
  slug: "gurgaon",
  name: "Gurgaon",
  altName: "Gurugram",
  state: "Haryana",
  geo: { lat: 28.4595, lng: 77.0266 },
  seoTitle: "Make Friends in Gurgaon – Weekend Plans & Clubs",
  seoDescription:
    "Find people to do things with in Gurgaon. Join turf games, breakfast rides to Damdama, movie nights and cafe meetups in Cyber Hub, Sector 29 and Golf Course Road.",
  keywords: [
    "make friends in gurgaon",
    "things to do in gurgaon",
    "weekend plans in gurgaon",
    "clubs in gurgaon",
    "riders club gurgaon",
    "turf near me gurgaon",
    "cricket team near me gurgaon",
    "badminton partners gurgaon",
    "meetups in gurgaon",
    "gurugram social groups",
    "bike ride groups gurgaon",
    "movie buddy gurgaon",
  ],
  h1: "Make Friends in Gurgaon: Weekend Plans, Clubs and Activities Near You",
  intro: [
    "Gurgaon is full of people who moved here for work and never quite built a circle. The city runs on office hours, the weekends are long, and the group chat you actually want — the one with the Sunday ride, the Friday turf slot, the people who will drive to Sohna for breakfast — is the hardest thing to find.",
    "SyncTrip is where that group chat starts. Post a plan or join one: a turf match short two players, a breakfast ride leaving Sector 29 at six, a movie nobody else in your office wants to watch, a Saturday cafe crawl through 32nd Avenue. You see who else is going before you commit, and everyone is verified before they show up.",
  ],
  activities: [
    {
      id: "sports",
      icon: "🏏",
      title: "Turf games and sports partners in Gurgaon",
      blurb:
        "Most turf bookings in Gurgaon fall apart for the same reason: two people drop out on the day and nobody wants to pay for an empty slot. Post the game, fill the missing spots, split the booking.",
      spots: [
        "Box cricket and football turfs around Sector 56 and Sohna Road",
        "Badminton and pickleball courts in Sector 29 and DLF Phase 3",
        "Morning running groups on Golf Course Road and the Aravalli Biodiversity Park trails",
        "Cycling loops through Gwal Pahari and the Faridabad–Gurgaon road",
      ],
    },
    {
      id: "rides",
      icon: "🏍️",
      title: "Bike rides and riders clubs out of Gurgaon",
      blurb:
        "Gurgaon has the best breakfast-ride geography in NCR — you are out of the city and into the Aravallis inside forty minutes. Find riders whose pace matches yours instead of joining a 200-strong group where nobody waits.",
      spots: [
        "Damdama Lake — the classic Sunday breakfast run, back before noon",
        "Sohna to Alwar via the Aravalli ghat section",
        "Delhi–Jaipur highway dawn runs to Neemrana and back",
        "Longer weekend hauls to Rishikesh, Jibhi and Spiti in season",
      ],
    },
    {
      id: "movies",
      icon: "🎬",
      title: "Movie nights and watch parties",
      blurb:
        "Match on the film first, plan the night second. Horror, Marvel, regional cinema, the one indie release playing at a single screen — there is someone in Gurgaon waiting for the same show.",
      spots: [
        "Ambience Mall and MGF Metropolitan, MG Road",
        "Cyber Hub screens and the DLF Mall of India crowd from across the border",
        "Late shows in Sector 29 with dinner after",
      ],
    },
    {
      id: "outings",
      icon: "☕",
      title: "Cafes, hangouts and weekend outings",
      blurb:
        "The kind of plan that is hard to make alone and easy to make with four people: a slow brunch, a market walk, an evening that has no agenda beyond leaving the flat.",
      spots: [
        "Cyber Hub and Galleria Market for the after-work crowd",
        "32nd Avenue and Sector 29 on weekends",
        "Sultanpur Bird Sanctuary and Aravalli Biodiversity Park for morning walks",
        "Kingdom of Dreams and Leisure Valley Park for one-off events",
      ],
    },
  ],
  localities: [
    "Cyber City & Cyber Hub",
    "Sector 29",
    "Golf Course Road",
    "Sohna Road",
    "DLF Phase 1–5",
    "Sector 56",
    "MG Road",
    "New Gurgaon (Sectors 81–95)",
    "Palam Vihar",
    "Sushant Lok",
    "Sector 14 & Old Gurgaon",
    "Manesar",
  ],
  localitiesNote:
    "Plans on SyncTrip are pinned to where they actually happen, so a Sohna Road turf game does not show up as an option for someone in Palam Vihar at 7pm on a weekday.",
  clubsNote:
    "Gurgaon's riding groups, sports collectives and hobby clubs run their meetups on SyncTrip: follow a club to get into its open chat room and get notified the moment it announces the next event.",
  getaways: [
    { name: "Neemrana", slug: "things-to-do-in-neemrana-rajasthan", distance: "~2 hrs", note: "Fort palace day trip down NH-48" },
    { name: "Alwar & Siliserh", slug: "things-to-do-in-alwar-rajasthan", distance: "~3 hrs", note: "Lake, forts and the Sariska road" },
    { name: "Agra", slug: "things-to-do-in-agra-uttar-pradesh", distance: "~3 hrs", note: "Yamuna Expressway, doable in a day" },
    { name: "Jaipur", slug: "things-to-do-in-jaipur-rajasthan", distance: "~4 hrs", note: "The standard NCR long weekend" },
    { name: "Rishikesh", slug: "things-to-do-in-rishikesh-uttarakhand", distance: "~6 hrs", note: "Rafting, camps and river cafes" },
    { name: "Lansdowne", slug: "things-to-do-in-lansdowne-uttarakhand", distance: "~7 hrs", note: "Quiet cantonment hill town" },
    { name: "Jim Corbett", slug: "things-to-do-in-jim-corbett-national-park-uttarakhand", distance: "~6 hrs", note: "Safari weekends from NCR" },
    { name: "Mussoorie", slug: "things-to-do-in-mussoorie-uttarakhand", distance: "~7 hrs", note: "Hills without the Himachal drive" },
    { name: "Shimla", slug: "things-to-do-in-shimla-himachal-pradesh", distance: "~8 hrs", note: "Overnight bus or an early start" },
    { name: "Kasol", slug: "things-to-do-in-kasol-himachal-pradesh", distance: "~12 hrs", note: "Parvati valley, best over 3 days" },
  ],
  reads: [
    { title: "Hidden gems in Delhi you would not find on Google Maps", slug: "hidden-gems-in-delhi-you-would-not-find-on-google-maps" },
    { title: "The ultimate Delhi to Ladakh bike trip guide", slug: "the-ultimate-delhi-to-ladakh-bike-trip-guide-routes-preperation-and-itinerary" },
  ],
  faqs: [
    {
      question: "How do I meet new people in Gurgaon?",
      answer:
        "Join a plan rather than an app full of strangers. On SyncTrip you pick something you were going to do anyway — a turf game, a Sunday ride, a movie, a cafe meetup — and see who else in Gurgaon is going before you commit. Everyone on the plan is verified, and most groups have an open chat room you can read before deciding.",
    },
    {
      question: "Where can I find players for turf cricket or football in Gurgaon?",
      answer:
        "Post the slot you have booked and how many players you are short, or join a game someone else has posted. Most activity is around Sector 56, Sohna Road and the Sector 29 courts, with weekday games starting after 7pm and weekend games from early morning.",
    },
    {
      question: "Are there bike riding groups in Gurgaon?",
      answer:
        "Yes — Damdama Lake and the Sohna ghat are the standard Sunday breakfast runs, and the Delhi–Jaipur highway is the usual dawn route towards Neemrana. On SyncTrip you can see the pace, distance and start point of a ride before joining, which matters more than group size.",
    },
    {
      question: "What are good weekend plans in Gurgaon?",
      answer:
        "In the city: a morning turf slot, a walk at Sultanpur or the Aravalli Biodiversity Park, brunch at 32nd Avenue, a late show in Sector 29. Out of the city: Damdama and Sohna are half-day trips, Neemrana and Alwar are full days, and Rishikesh, Jaipur or Jim Corbett fill a long weekend.",
    },
    {
      question: "Is SyncTrip free to use in Gurgaon?",
      answer:
        "Yes. The app is free on Android and iOS — creating plans, joining them and using group chat cost nothing. Some club events sell tickets, and the price is always shown before you book.",
    },
  ],
  nearby: ["delhi", "noida", "faridabad"],
};

const DELHI: CityPage = {
  slug: "delhi",
  name: "Delhi",
  state: "Delhi NCR",
  geo: { lat: 28.6139, lng: 77.209 },
  seoTitle: "Make Friends in Delhi – Weekend Plans & Meetups",
  seoDescription:
    "Find people to do things with in Delhi. Join weekend meetups, turf games, breakfast rides, movie nights and cafe hangouts from Hauz Khas to Connaught Place.",
  keywords: [
    "make friends in delhi",
    "things to do in delhi this weekend",
    "weekend plans in delhi",
    "meetups in delhi",
    "delhi social groups",
    "riders club delhi",
    "turf near me delhi",
    "movie buddy delhi",
    "delhi ncr activities",
  ],
  h1: "Make Friends in Delhi: Weekend Plans, Meetups and Activities Near You",
  intro: [
    "Delhi is not short of things to do — it is short of people to do them with on a Tuesday. The city is big enough that your college group lives an hour away and your work friends clock out in the opposite direction.",
    "SyncTrip fixes the coordination, not the city. Post the plan you already wanted — a heritage walk through Mehrauli, a badminton court in Dwarka, the 10pm show at Select Citywalk — and fill it with verified people who are actually in your part of Delhi.",
  ],
  activities: [
    {
      id: "outings",
      icon: "☕",
      title: "Weekend meetups and city walks",
      blurb:
        "Delhi rewards walking more than almost any Indian city, and almost nobody does it alone. Find a group for the morning that would otherwise be spent scrolling.",
      spots: [
        "Hauz Khas Village, Deer Park and the Mehrauli Archaeological Park trail",
        "Lodhi Art District and Sunder Nursery on weekend mornings",
        "Connaught Place and Khan Market for the after-work crowd",
        "Chandni Chowk and Old Delhi food walks",
      ],
    },
    {
      id: "sports",
      icon: "🏏",
      title: "Turf games, courts and running groups",
      blurb:
        "Book the slot, post the game, fill the gaps. Weeknight cricket and football across the city, badminton courts that are empty at 6am and packed at 8pm.",
      spots: [
        "Box cricket and football turfs in Dwarka, Rohini and Saket",
        "Badminton courts across South Delhi and Vasant Kunj",
        "Running groups at Lodhi Garden, Nehru Park and the Yamuna Sports Complex",
      ],
    },
    {
      id: "rides",
      icon: "🏍️",
      title: "Breakfast rides and riders clubs",
      blurb:
        "Out of the city before the traffic wakes up. Delhi riders have three good directions and a lot of company for all of them.",
      spots: [
        "Damdama Lake and Sohna via Gurgaon",
        "Neemrana and the Delhi–Jaipur highway dawn run",
        "Vrindavan and Mathura on the Yamuna Expressway",
        "Rishikesh and the Uttarakhand foothills for weekend hauls",
      ],
    },
    {
      id: "movies",
      icon: "🎬",
      title: "Movie nights and watch parties",
      blurb:
        "Match on the film, then plan the night. There is always someone in Delhi holding out for the same release you are.",
      spots: [
        "Select Citywalk, Saket and the DLF Promenade screens",
        "PVR Director's Cut and the Vasant Kunj cluster",
        "Late shows in CP with dinner after",
      ],
    },
  ],
  localities: [
    "Hauz Khas",
    "Connaught Place",
    "Saket & Malviya Nagar",
    "Dwarka",
    "Rohini",
    "Greater Kailash",
    "Vasant Kunj",
    "Lajpat Nagar",
    "Karol Bagh",
    "Janakpuri",
    "Mayur Vihar",
    "Old Delhi",
  ],
  localitiesNote:
    "Plans are pinned to where they happen, so you are not offered a Dwarka game while you are sitting in Mayur Vihar on a weeknight.",
  clubsNote:
    "Delhi's riding groups, sports collectives and interest clubs run their meetups on SyncTrip — follow one to get into its chat room and hear about events before they fill.",
  getaways: [
    { name: "Agra", slug: "things-to-do-in-agra-uttar-pradesh", distance: "~3 hrs", note: "Yamuna Expressway day trip" },
    { name: "Neemrana", slug: "things-to-do-in-neemrana-rajasthan", distance: "~2.5 hrs", note: "Fort palace and zipline" },
    { name: "Jaipur", slug: "things-to-do-in-jaipur-rajasthan", distance: "~5 hrs", note: "Classic NCR long weekend" },
    { name: "Rishikesh", slug: "things-to-do-in-rishikesh-uttarakhand", distance: "~6 hrs", note: "Rafting and river camps" },
    { name: "Nainital", slug: "things-to-do-in-nainital-uttarakhand", distance: "~7 hrs", note: "Lake town, best off-season" },
    { name: "Jim Corbett", slug: "things-to-do-in-jim-corbett-national-park-uttarakhand", distance: "~6 hrs", note: "Safari weekend" },
    { name: "Mussoorie", slug: "things-to-do-in-mussoorie-uttarakhand", distance: "~7 hrs", note: "Hill station standby" },
    { name: "Shimla", slug: "things-to-do-in-shimla-himachal-pradesh", distance: "~9 hrs", note: "Overnight, then three days" },
  ],
  reads: [
    { title: "Hidden gems in Delhi you would not find on Google Maps", slug: "hidden-gems-in-delhi-you-would-not-find-on-google-maps" },
    { title: "Weekend escapes from Delhi, Mumbai and Bangalore", slug: "weekend-escapes-november-delhi-mumbai-bangalore" },
  ],
  faqs: [
    {
      question: "How do I meet new people in Delhi?",
      answer:
        "Start from the activity, not the profile. Join a plan on SyncTrip — a city walk, a turf slot, a movie, a cafe meetup — and you meet people while doing something, which is easier than meeting them to decide whether to do something. Every member is verified.",
    },
    {
      question: "What are good things to do in Delhi this weekend?",
      answer:
        "Mornings suit Sunder Nursery, Lodhi Garden and the Mehrauli park trail; afternoons suit Hauz Khas, Khan Market and the Lodhi Art District; evenings suit a Saket or CP screen. Out of town, Damdama, Neemrana and Agra are all same-day trips.",
    },
    {
      question: "Are there riding groups in Delhi?",
      answer:
        "Plenty. The reliable Sunday routes are Damdama via Gurgaon, Neemrana down NH-48 and Vrindavan on the Yamuna Expressway. SyncTrip shows a ride's pace, distance and start point up front so you can pick one that fits how you actually ride.",
    },
    {
      question: "Is SyncTrip free in Delhi?",
      answer:
        "Yes — free on Android and iOS. Making plans, joining them and group chat cost nothing. Ticketed club events show their price before you book.",
    },
  ],
  nearby: ["gurgaon", "noida", "faridabad"],
};

const NOIDA: CityPage = {
  slug: "noida",
  name: "Noida",
  state: "Uttar Pradesh",
  geo: { lat: 28.5355, lng: 77.391 },
  seoTitle: "Make Friends in Noida – Weekend Plans & Activities",
  seoDescription:
    "Find people to do things with in Noida and Greater Noida. Join turf games, weekend rides, movie nights and cafe meetups around Sector 18, Sector 62 and Sector 137.",
  keywords: [
    "make friends in noida",
    "things to do in noida",
    "weekend plans in noida",
    "meetups in noida",
    "turf near me noida",
    "riders club noida",
    "greater noida activities",
    "noida social groups",
  ],
  h1: "Make Friends in Noida: Weekend Plans, Games and Meetups Near You",
  intro: [
    "Noida is a commuter city with a young population and a weekend problem: everyone is here for work, half the people you know live across a toll bridge, and plans die in the group chat.",
    "SyncTrip turns the plan into something you can join in one tap. Post the turf slot, the ride, the movie or the brunch — and fill it with verified people who are actually in your sector, not on the other side of the Yamuna.",
  ],
  activities: [
    {
      id: "sports",
      icon: "🏏",
      title: "Turf cricket, football and courts",
      blurb:
        "Noida has more turf per square kilometre than most of NCR and the same problem everywhere else: two players short by Friday evening.",
      spots: [
        "Box cricket and football turfs around Sector 62, Sector 63 and Sector 137",
        "Badminton courts in Sector 21A and the Noida Stadium complex",
        "Cycling and running groups along the Noida–Greater Noida Expressway service road",
      ],
    },
    {
      id: "outings",
      icon: "☕",
      title: "Cafes, malls and weekend hangouts",
      blurb: "The plans that need three people to be worth doing, and one person to actually start.",
      spots: [
        "Sector 18 market and the Atta Market strip",
        "DLF Mall of India and the Great India Place crowd",
        "Botanic Garden and Okhla Bird Sanctuary morning walks",
        "Worlds of Wonder and the Sector 137 riverside cafes",
      ],
    },
    {
      id: "rides",
      icon: "🏍️",
      title: "Rides out of Noida",
      blurb: "The Yamuna Expressway is the fastest exit from NCR, and the ride crowd here knows it.",
      spots: [
        "Vrindavan and Mathura breakfast runs",
        "Agra day rides down the Yamuna Expressway",
        "Longer hauls towards Rishikesh and the Uttarakhand foothills",
      ],
    },
    {
      id: "movies",
      icon: "🎬",
      title: "Movie nights",
      blurb: "Match on the film, sort the show, go.",
      spots: ["DLF Mall of India screens", "The Great India Place and Logix City Centre", "Late shows in Sector 18"],
    },
  ],
  localities: [
    "Sector 18",
    "Sector 62",
    "Sector 137",
    "Sector 15 & 16",
    "Sector 50",
    "Sector 76–78",
    "Greater Noida West",
    "Alpha & Beta, Greater Noida",
    "Noida Extension",
    "Sector 128 & the Expressway",
  ],
  localitiesNote:
    "Sector-level pinning matters more in Noida than anywhere else in NCR — a Sector 137 plan and a Sector 62 plan are forty minutes apart on a bad evening.",
  clubsNote:
    "Follow a Noida club to get into its open chat room and hear about its next meetup, ride or match before the seats go.",
  getaways: [
    { name: "Agra", slug: "things-to-do-in-agra-uttar-pradesh", distance: "~2.5 hrs", note: "The shortest good day trip in NCR" },
    { name: "Neemrana", slug: "things-to-do-in-neemrana-rajasthan", distance: "~3 hrs", note: "Fort palace weekend" },
    { name: "Jim Corbett", slug: "things-to-do-in-jim-corbett-national-park-uttarakhand", distance: "~6 hrs", note: "Safari weekend" },
    { name: "Rishikesh", slug: "things-to-do-in-rishikesh-uttarakhand", distance: "~6 hrs", note: "River camps and rafting" },
    { name: "Nainital", slug: "things-to-do-in-nainital-uttarakhand", distance: "~7 hrs", note: "Lake town escape" },
    { name: "Jaipur", slug: "things-to-do-in-jaipur-rajasthan", distance: "~5.5 hrs", note: "Long weekend standby" },
  ],
  reads: [
    { title: "Hidden gems in Delhi you would not find on Google Maps", slug: "hidden-gems-in-delhi-you-would-not-find-on-google-maps" },
  ],
  faqs: [
    {
      question: "How do I meet new people in Noida?",
      answer:
        "Join a plan near your sector instead of trying to build a social circle from scratch. SyncTrip shows verified people going to the same turf game, ride, movie or meetup, and most groups have an open chat you can read first.",
    },
    {
      question: "Where do people play turf cricket and football in Noida?",
      answer:
        "The heaviest activity is around Sectors 62, 63 and 137, with weekday games after 7pm and weekend slots from early morning. Post how many players you are short and the slot usually fills the same day.",
    },
    {
      question: "What are good weekend plans in Noida?",
      answer:
        "A morning turf slot or a walk at the Botanic Garden, brunch around Sector 18, an evening show at DLF Mall of India — or leave town entirely: Vrindavan and Agra are both easy day rides down the Yamuna Expressway.",
    },
  ],
  nearby: ["delhi", "gurgaon", "faridabad"],
};

const FARIDABAD: CityPage = {
  slug: "faridabad",
  name: "Faridabad",
  state: "Haryana",
  geo: { lat: 28.4089, lng: 77.3178 },
  seoTitle: "Make Friends in Faridabad – Weekend Plans & Rides",
  seoDescription:
    "Find people to do things with in Faridabad. Join Aravalli rides, turf games, Surajkund weekend outings and movie nights with verified people near you.",
  keywords: [
    "make friends in faridabad",
    "things to do in faridabad",
    "weekend plans faridabad",
    "riders club faridabad",
    "turf near me faridabad",
    "surajkund weekend",
    "faridabad meetups",
  ],
  h1: "Make Friends in Faridabad: Weekend Plans, Rides and Meetups Near You",
  intro: [
    "Faridabad sits closer to the Aravallis than any other part of NCR, which makes it the easiest place in the region to get out of the city on a Sunday morning — and the hardest to find four other people who want to.",
    "SyncTrip is where those plans get made: a ride to Damdama through the hills, a turf slot that needs two more players, a Surajkund morning, a late show after.",
  ],
  activities: [
    {
      id: "rides",
      icon: "🏍️",
      title: "Aravalli rides and riders clubs",
      blurb: "The best hill road in NCR starts twenty minutes from most of Faridabad.",
      spots: [
        "Faridabad–Gurgaon road through the Aravalli ridge",
        "Damdama Lake and Sohna breakfast runs",
        "Pali–Dhauj and the Badkhal loop",
        "Longer weekend hauls to Neemrana and Alwar",
      ],
    },
    {
      id: "outings",
      icon: "☕",
      title: "Weekend outings and walks",
      blurb: "The parts of Faridabad worth a Saturday, with people to see them with.",
      spots: [
        "Surajkund and the crafts mela grounds",
        "Badkhal Lake and the Aravalli trails",
        "Sector 15 and Crown Interiorz for the evening crowd",
      ],
    },
    {
      id: "sports",
      icon: "🏏",
      title: "Turf games and sports partners",
      blurb: "Post the slot, fill the missing players, split the booking.",
      spots: [
        "Box cricket and football turfs around Sector 15 and NIT Faridabad",
        "Badminton courts across the Greater Faridabad sectors",
        "Morning running and cycling groups on the bypass road",
      ],
    },
    {
      id: "movies",
      icon: "🎬",
      title: "Movie nights",
      blurb: "Someone else is waiting for the same release.",
      spots: ["Crown Interiorz and SRS Mall screens", "Late shows with dinner after"],
    },
  ],
  localities: [
    "Sector 15",
    "NIT Faridabad",
    "Greater Faridabad (Neharpar)",
    "Sector 21",
    "Ballabgarh",
    "Surajkund",
    "Sector 88–89",
  ],
  localitiesNote: "Plans are pinned to where they happen, so an Old Faridabad meetup is not offered to someone in Neharpar on a weeknight.",
  clubsNote: "Follow a local club to get into its chat room and hear about the next ride or meetup first.",
  getaways: [
    { name: "Delhi NCR", slug: "things-to-do-in-delhi-ncr-india", distance: "~1 hr", note: "The rest of the region" },
    { name: "Neemrana", slug: "things-to-do-in-neemrana-rajasthan", distance: "~2.5 hrs", note: "Fort palace day trip" },
    { name: "Alwar", slug: "things-to-do-in-alwar-rajasthan", distance: "~3 hrs", note: "Siliserh lake and Sariska" },
    { name: "Agra", slug: "things-to-do-in-agra-uttar-pradesh", distance: "~3 hrs", note: "Day trip by expressway" },
    { name: "Jaipur", slug: "things-to-do-in-jaipur-rajasthan", distance: "~4.5 hrs", note: "Long weekend" },
    { name: "Rishikesh", slug: "things-to-do-in-rishikesh-uttarakhand", distance: "~7 hrs", note: "River weekend" },
  ],
  reads: [
    { title: "Hidden gems in Delhi you would not find on Google Maps", slug: "hidden-gems-in-delhi-you-would-not-find-on-google-maps" },
  ],
  faqs: [
    {
      question: "How do I meet new people in Faridabad?",
      answer:
        "Join an activity rather than an introduction. SyncTrip shows verified people heading to the same ride, turf slot, walk or movie near you, and you can read the group chat before deciding to go.",
    },
    {
      question: "Are there bike riding groups in Faridabad?",
      answer:
        "Yes — the Aravalli ridge road towards Gurgaon and the Damdama–Sohna loop are the standard Sunday runs, and Pali–Dhauj is the short version. Ride pace and distance are listed before you join.",
    },
    {
      question: "What is there to do in Faridabad on a weekend?",
      answer:
        "Surajkund and Badkhal Lake in the morning, the Aravalli trails if you want to walk or ride, a turf game in the evening, and Neemrana or Alwar if you would rather leave the city entirely.",
    },
  ],
  nearby: ["gurgaon", "delhi", "noida"],
};

export const CITY_PAGES: CityPage[] = [GURGAON, DELHI, NOIDA, FARIDABAD];

export const CITY_SLUGS = CITY_PAGES.map((c) => c.slug);

export function getCityPage(slug: string): CityPage | null {
  return CITY_PAGES.find((c) => c.slug === slug.toLowerCase()) ?? null;
}
