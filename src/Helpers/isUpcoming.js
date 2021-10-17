export const isUpcoming = (date) => {
  const dateObject = new Date();
  const d = dateObject.getDate();
  const m = dateObject.getMonth() + 1;
  const y = dateObject.getFullYear();

  if (date.date >= d && date.month >= m && date.year >= y) {
    return true;
  }

  return false;
};
