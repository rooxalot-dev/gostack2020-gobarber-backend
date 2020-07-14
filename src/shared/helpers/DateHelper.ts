export const getDateUTC = (date: Date): Date => {
  const dateUTC = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDay(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()));

  return dateUTC;
};
