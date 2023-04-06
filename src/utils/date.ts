export const getTimeDifferenceInSeconds = (time: number) => {
  const seconds = Math.floor((time - new Date().getTime()) / 1000);
  return seconds;
};
