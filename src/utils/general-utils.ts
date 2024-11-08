export const generateRandomWidth = (
  minPercent: number = 5,
  maxPercent: number = 100
): string => {
  const randomWidth =
    Math.floor(Math.random() * (maxPercent - minPercent + 1)) + minPercent;
  return `${randomWidth}%`;
};
