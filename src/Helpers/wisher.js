export function wish() {
  var data = [
      [0, 4, "Good Night"],
      [5, 11, "Good Morning"], //Store messages in an array
      [12, 17, "Good Afternoon"],
      [18, 24, "Good Night"],
    ],
    hr = new Date().getHours();

  for (var i = 0; i < data.length; i++) {
    if (hr >= data[i][0] && hr <= data[i][1]) {
      return data[i][2];
    }
  }
}
