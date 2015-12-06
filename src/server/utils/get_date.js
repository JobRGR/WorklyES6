let getDate = (val) => {
  let date = new Date()
  date.setFullYear(date.getFullYear() - val)
  return date
}

export default (start, end) => {
  return {
    $gte: start ? getDate(start) : new Date(0, 0, 0),
    $lt: end ? getDate(end) : new Date()
  }
}