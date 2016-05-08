import pluralize from 'pluralize'

export default function (name) {
  this.name = name
  this.names = pluralize(name, 2)

  return {
    nextItem: (err, item, res, next) => {
      res[this.name] = item
      next(err)
    },
    nextItems: (err, items, res, next) => {
      res[this.names] = items
      next(err)
    },
    nextCount: (err, count, res, next) => {
      res.count = count
      next(err)
    }
  }
}
