export const START_TIME = new Date("2026-03-10T10:00:00+05:30"); // 13 March 10 AM IST
export const END_TIME = new Date("2026-03-14T10:00:00+05:30"); // 14 March 10 AM IST

interface Question {
  id: number;
  question: string;
  type: "mcq" | "multiple" | "short";
  required: boolean;
  options?: string[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Have you ever organized a trip, event, or outing for a group of people?",
    type: "mcq",
    required: true,
    options: ["Yes, many times", "Yes, once or twice", "I have helped someone organize", "Never"]
  },
  {
    id: 2,
    question: "How often do you actively look for new experiences, places, or events around you?",
    type: "mcq",
    required: true,
    options: ["Very often (weekly)", "Occasionally (monthly)", "Rarely", "Almost never"]
  },
  {
    id: 3,
    question: "When visiting a new city or place, how do you usually discover things to do?",
    type: "multiple",
    required: true,
    options: ["Google searches or blogs", "Social media (Instagram / TikTok)", "Asking locals or friends", "Travel apps", "Exploring randomly"]
  },
  {
    id: 4,
    question: "How comfortable are you interacting or collaborating with people you haven't met before?",
    type: "mcq",
    required: true,
    options: ["Very comfortable", "Somewhat comfortable", "Neutral", "Not very comfortable"]
  },
  {
    id: 5,
    question: "Describe a time when you had to figure something out without clear instructions.",
    type: "short",
    required: true
  },
  {
    id: 6,
    question: "What challenges do you usually face when organizing plans with a group?",
    type: "multiple",
    required: true,
    options: ["Budget constraints", "Aligning schedules", "Deciding on activities", "Finding reliable information", "Getting everyone to commit"]
  },
  {
    id: 7,
    question: "What usually motivates you to explore new places or experiences?",
    type: "multiple",
    required: false,
    options: ["Learning about cultures", "Meeting new people", "Adventure or thrill", "Relaxation", "Food and local experiences"]
  },
  {
    id: 8,
    question: "Which factors matter most to you when choosing a place or activity to explore?",
    type: "multiple",
    required: true,
    options: ["Cost", "Distance", "Reviews or ratings", "Uniqueness", "Safety"]
  },
  {
    id: 9,
    question: "Tell us about a situation where you helped solve a problem for a group of people.",
    type: "short",
    required: true
  },
  {
    id: 10,
    question: "When trying something completely new, which mindset best describes you?",
    type: "mcq",
    required: true,
    options: ["Excited and eager", "Curious but cautious", "Nervous but willing", "Prefer familiar things"]
  },
  {
    id: 11,
    question: "What do you think stops people most often from trying new experiences?",
    type: "multiple",
    required: false,
    options: ["Fear of the unknown", "Lack of time", "Financial constraints", "Not having companions", "Safety concerns"]
  },
  {
    id: 12,
    question: "How do you usually plan trips or major activities?",
    type: "mcq",
    required: true,
    options: ["Detailed itinerary", "Rough outline with flexibility", "Mostly spontaneous"]
  },
  {
    id: 13,
    question: "If you were designing a product that helps people explore new places or meet others, what feature would you build first?",
    type: "short",
    required: true
  },
  {
    id: 14,
    question: "Which of the following situations would excite you the most?",
    type: "mcq",
    required: true,
    options: ["Backpacking across multiple cities", "Exploring a new city with locals", "A peaceful nature retreat", "Attending cultural events in a new place"]
  },
  {
    id: 15,
    question: "What difficulties do people face when trying to meet like-minded individuals while traveling?",
    type: "multiple",
    required: true,
    options: ["Language barriers", "Safety concerns", "Not knowing where to look", "Social anxiety", "Trust issues"]
  },
  {
    id: 16,
    question: "Describe a personal challenge or goal you pursued that required persistence.",
    type: "short",
    required: true
  },
  {
    id: 17,
    question: "How important is trust and safety when interacting with new people through a platform?",
    type: "mcq",
    required: true,
    options: ["Extremely important", "Very important", "Somewhat important", "Not very important"]
  },
  {
    id: 18,
    question: "As a SDE, if you could change one thing about SyncTrip, what it would be? How would you approach the same?",
    type: "short",
    required: true
  }
];
// export const QUESTIONS: Question[] = [
//   { id: 1, question: "Have you ever planned or organized a trip, event, or outing for a group of people?", type: "mcq", required: true, options: ["Yes, frequently", "Yes, occasionally", "Rarely", "Never"] },
//   { id: 2, question: "How often do you actively look for new experiences, events, or places around you?", type: "mcq", required: true, options: ["Daily", "Weekly", "Monthly", "Rarely"] },
//   { id: 3, question: "When exploring a new city or place, what is your usual approach to discovering things to do?", type: "multiple", required: true, options: ["Google Searches", "Social Media (Instagram/TikTok)", "Asking Locals", "Wandering aimlessly", "Travel Apps"] },
//   { id: 4, question: "What motivates you most to explore new places or experiences?", type: "multiple", required: true, options: ["Learning about cultures", "Relaxation", "Meeting new people", "Food and culinary experiences", "Adventure/Thrill"] },
//   { id: 5, question: "Describe a time when you had to figure something out without clear guidance.", type: "short", required: true },
//   { id: 6, question: "What challenges do you usually face when planning an outing, trip, or group activity?", type: "multiple", required: true, options: ["Budget constraints", "Aligning schedules", "Finding good accommodations", "Deciding on activities"] },
//   { id: 7, question: "How comfortable are you with meeting or collaborating with people you haven't met before?", type: "mcq", required: true, options: ["Very comfortable", "Somewhat comfortable", "Neutral", "Somewhat uncomfortable"] },
//   { id: 8, question: "Which factors matter most to you when choosing a place or activity to explore?", type: "multiple", required: true, options: ["Cost", "Distance", "Reviews/Ratings", "Uniqueness", "Safety"] },
//   { id: 9, question: "Tell us about a situation where you helped solve a problem for a group of people.", type: "short", required: true },
//   { id: 10, question: "When trying something new, which of the following best describes your mindset?", type: "mcq", required: true, options: ["Excited and eager", "Cautiously optimistic", "Nervous but willing", "Reluctant"] },
//   { id: 11, question: "What usually stops people from trying new experiences or exploring new places?", type: "multiple", required: true, options: ["Fear of the unknown", "Lack of time", "Financial constraints", "Lack of companions"] },
//   { id: 12, question: "How do you usually plan trips or major activities?", type: "mcq", required: true, options: ["Detailed itinerary", "Rough outline", "Completely spontaneous"] },
//   { id: 13, question: "If you were designing a product to help people explore new places or meet others, what features would you prioritize?", type: "short", required: false },
//   { id: 14, question: "Which of these situations would excite you the most?", type: "mcq", required: true, options: ["Backpacking across Europe", "A luxury resort stay", "A quiet cabin in the woods", "A bustling city tour"] },
//   { id: 15, question: "What difficulties do people face when trying to meet like-minded individuals while exploring new places?", type: "multiple", required: false, options: ["Language barriers", "Safety concerns", "Not knowing where to look", "Social anxiety"] },
//   { id: 16, question: "Describe a personal challenge or goal you pursued that required persistence.", type: "short", required: true },
//   { id: 17, question: "How important is safety and trust when interacting with new people or communities?", type: "mcq", required: true, options: ["Crucial", "Very important", "Somewhat important", "Not a primary concern"] },
//   { id: 18, question: "What excites you most about working on products that help people explore, connect, or travel?", type: "short", required: true }
// ];