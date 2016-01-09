export const monthList = [['Jan.', 'Feb.', 'Mar.', 'Apr.', 'Ma.', 'June', 'July', 'Au.g', 'Sept.', 'Oct.', 'Nov.', 'Dec.']]

export let checkDate = ({min = (new Date(0, 0, 0)).toGMTString(), max = (new Date()).toGMTString()}, date) => {
  date = new Date(date)
  min = new Date(min)
  max = new Date(max)
  return date.valueOf() >= min.valueOf() && date.valueOf() <= max.valueOf()
}

export let getHourInDay = (month = (new Date()).getMonth(), year = (new Date()).getFullYear()) => {
  let date = new Date(year, month, 1)
  let days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

export let getDayInMonth = (month = (new Date()).getMonth(), year = (new Date()).getFullYear(), day = (new Date()).getDate()) => {
  let date = new Date(year, month, day)
  let hours = []
  do {
    hours.push(new Date(date))
    hours.setHours(date.getHours() + 1)
  } while (date.getHours() === 0)
  return hours
}


export let getMonthInYear = (year = (new Date()).getFullYear()) => {
  let date = new Date(year, 0, 1)
  let months = []
  while (date.getFullYear() === year) {
    months.push(new Date(date))
    date.setMonth(date.getMonth() + 1)
  }
  return months
}

export let getRanges = type => {
  let items = null
  let range = []
  if (type == 'month') {
    items = getDayInMonth()
    let newDate = new Date(items[items.length])
    newDate.setDate(newDate.getDate() + 1)
    return newDate
  }
  else if (type == 'year') {
    items = getMonthInYear()
    let date = new Date(items[items.length])
    date.setMonth(date.getMonth() + 1)
    items.push(date)
  }
  else if (type == 'day') {
    items = getHourInDay()
    let date = new Date(items[items.length])
    date.setHours(date.getHours() + 1)
    items.push(date)
  }
  for (let i = 0; i < items.length - 1; i++) {
    range.push({min: items[i], max: items[i + 1]})
  }
  return range
}