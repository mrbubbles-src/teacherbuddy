/**
 * Capitalizes the first letter of a given string.
 *
 * @param word - The input string to capitalize. If the string is empty, it will return an empty string.
 * @returns A new string with the first letter capitalized and the rest of the string unchanged.
 *
 * @example
 * ```typescript
 * capitalizeFirstLetter("hello"); // "Hello"
 * capitalizeFirstLetter("world"); // "World"
 * capitalizeFirstLetter(""); // ""
 * ```
 */
export const capitalizeFirstLetter = (word: string) => {
  return (word.at(0)?.toUpperCase() || '') + word.slice(1);
};
