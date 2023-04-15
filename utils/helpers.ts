import * as natural from "natural";

export const capitalizeWords = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const isWithinLevenshteinDistance = (str1: string, str2: string) => {
  const levDistance = natural.LevenshteinDistance(str1, str2, { search: true });
  return levDistance <= 2;
};

export const getFirstAndLastName = (name: string) => {
  const parts = name.split(" ").filter(Boolean);
  const firstName = parts[0];
  const lastName = parts[1];
  return `${firstName} ${lastName}`;
};
