export const isUpcoming = (date) => {
  const dateObject = new Date();
  const d = dateObject.getDate();
  const m = dateObject.getMonth() + 1;
  const y = dateObject.getFullYear();
  console.log(d, y, m);

  if (date.date >= d && date.month >= m && date.year >= y) {
    return true;
  }

  return false;
};
