export const monthList = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'Ma.', 'June', 'July', 'Au.g', 'Sept.', 'Oct.', 'Nov.', 'Dec.']

export let checkDate = ({min = new Date(0, 0, 0), max = new Date()}, date) => {
  min = new Date(min)
  max = new Date(max)
  return date.valueOf() >= min.valueOf() && date.valueOf() <= max.valueOf()
}

export let getHourInDay = (month = (new Date()).getMonth(), year = (new Date()).getFullYear(), day = (new Date()).getDate(), hour = (new Date()).getHours()) => {
  let date = new Date(year, month, day - 1, hour)
  let hours = []
  do {
    hours.push(new Date(date))
    date.setHours(date.getHours() + 1)
  } while (date.getHours() != hour)
  hours.push(new Date(date))
  return hours
}

export let getDayInMonth = (month = (new Date()).getMonth(), year = (new Date()).getFullYear(), day = (new Date()).getDate()) => {
  let date = new Date(year, month - 1, day)
  let days = []
 do {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  } while (date.getDate() != day)
  days.push(new Date(date))
  return days
}

export let getMonthInYear = (year = (new Date()).getFullYear(), month = (new Date()).getMonth()) => {
  let date = new Date(year - 1, month, 1)
  let months = []
  do {
    months.push(new Date(date))
    date.setMonth(date.getMonth() + 1)
  } while (date.getMonth() != month)
  months.push(new Date(date))
  return months
}

export let getRanges = type => {
  let items = null
  let range = []
  if (type == 'month') {
    items = getDayInMonth()
    let date = new Date(items[items.length - 1])
    date.setDate(date.getDate() + 1)
    items.push(date)
  }
  else if (type == 'year') {
    items = getMonthInYear()
    let date = new Date(items[items.length - 1])
    date.setMonth(date.getMonth() + 1)
    items.push(date)
  }
  else if (type == 'day') {
    items = getHourInDay()
    let date = new Date(items[items.length - 1])
    date.setHours(date.getHours() + 1)
    items.push(date)
  }
  for (let i = 0; i < items.length - 1; i++) {
    range.push({min: items[i], max: items[i + 1]})
  }
  return range
}
