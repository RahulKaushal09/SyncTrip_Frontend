export type Category = "movies" | "hangouts" | "events" | "sports";

const PATHS: Record<Category, string> = {
  movies: "/hangouts/movies",
  hangouts: "/hangouts",
  events: "/hangouts/events",
  sports: "/hangouts/sports",
};

/** Subdomain in production, plain path in dev (where middleware keeps /hangouts/* reachable). */
export const categoryHref = (c: Category) =>
  process.env.NODE_ENV === "production" ? `https://${c}.synctrip.in` : PATHS[c];

export const categoryUrl = (c: Category) => `https://${c}.synctrip.in`;

/** Links back to the main site must be absolute: on a subdomain "/" is the category page. */
export const SITE = "https://synctrip.in";
