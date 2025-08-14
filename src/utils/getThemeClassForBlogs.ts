// utils/getThemeClass.ts
const categoryThemeMap: Record<string, string> = {
  culture: "tag-culture",
  adventure: "tag-adventure",
  food: "tag-food",
  city: "tag-city",
  nature: "tag-nature",
};

// Fallback themes for unknown categories
const fallbackThemes = Object.values(categoryThemeMap);

// Simple hash function to get consistent "random" index
const hashString = (str: string) =>
  str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

export const getThemeClass = (tag: string) => {
  const key = tag.toLowerCase().trim();
  if (categoryThemeMap[key]) return categoryThemeMap[key];

  // Stable pseudo-random selection
  const index = hashString(key) % fallbackThemes.length;
  return fallbackThemes[index];
};
