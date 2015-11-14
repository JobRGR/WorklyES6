import pluralize from 'pluralize'

export default function (name) {
  this.name = name
  this.names = pluralize(name, 2)

  let nextItem = (err, item, req, next) => {
    req[this.name] = item
    next(err)
  }

  let nextItems = (err, items, req, next) => {
    req[this.names] = items
    next(err)
  }

  return {nextItem, nextItems}
}