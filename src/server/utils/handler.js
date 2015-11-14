import pluralize from 'pluralize'

let Handler = function (name, Module) {
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

  return {
    getItem: (req, res, next) => Module.getItem(req.params.id, (err, item) => nextItem(err, item, req, next)),
    searchItem: (req, res, next) => Module.searchItem(req.query[name], (err, item) => nextItem(err, item, req, next)),
    getRandom: (req, res, next) => Module.getRandom((err, item) => nextItem(err, item, req, next)),
    getAll: (req, res, next) => Module.getItem(null, (err, items) => nextItems(err, items, req, next)),
    addItem: (req, res, next) => Module.addItem(req.body, (err, item) => nextItem(err, item, req, next)),
    updateItem: (req, res, next) => Module.updateItem(req.params.id, req.body, (err, item) => nextItem(err, item, req, next)),
    removeItem: (req, res, next) => Module.removeItem(req.params.id, err => res.send({ok: err || true})),
    removeAll: (req, res, next) => Module.removeItem(null, err => res.send({ok: err || true})),
    getCount: (req, res, next) => Module.getCount((err, count) => res.send({count})),
    autocomplete: (req, res, next) => Module.autocomplete(req.query[name], (err, items) => nextItems(err, items, req, next)),
    sendItem: (req, res, next) => res.send({[this.name]: req[this.name]}),
    sendItems: (req, res, next) => res.send({[this.names]: req[this.names]})
  }
}

export default Handler