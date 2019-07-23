const getDateList = (type) => {
  let begin = new Date('1980-01-01');
  let beginYear = begin.getFullYear();
  let beginMonth = begin.getMonth();

  let now = new Date();
  let nowYear = now.getFullYear();
  let nowMonth = now.getMonth();

  let dateList = [];
  for (let y = nowYear; y >= beginYear; y--) {
    for (let m = 11; m >= 0; m--) {
      dateList.push({
        title: '',
        value: y + '-' + (m + 1)
      });
    }
  }
  dateList = dateList.slice(11 - nowMonth, dateList.length - beginMonth);
  return dateList;
}

module.exports = {
  getDateList
}