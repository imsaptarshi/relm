export function formatDate(date) {
  const Months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (date) {
    return `${Months[date.month - 1]} ${date.date}, ${date.time} GMT+5:30`;
  }
}
