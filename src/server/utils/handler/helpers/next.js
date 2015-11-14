import pluralize from 'pluralize'

export default function (name) {
  this.name = name
  this.names = pluralize(name, 2)

  return {
    nextItem: (err, item, req, next) => {
      req[this.name] = item
      next(err)
    },
    nextItems: (err, items, req, next) => {
      req[this.names] = items
      next(err)
    },
    nextCount: (err, count, req, next) => {
      req.count = count
      next(err)
    }
  }
}