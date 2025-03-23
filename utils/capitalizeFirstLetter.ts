export const capitalizeFirstLetter = (word: string) => {
  return (word.at(0)?.toUpperCase() || '') + word.slice(1);
};
