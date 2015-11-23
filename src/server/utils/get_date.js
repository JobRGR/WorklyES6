let getDate = (val) => {
  let date = new Date()
  date.setFullYear($lt.getFullYear() - val)
  date.setDate($lt.getDate() - 1)
  return date
}

export default (start, end) => {
  return {
    $gt: start ? getDate(start) : new Date(0, 0, 0),
    $lt: end ? getDate(end) : new Date()
  }
}