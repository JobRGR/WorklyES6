import pluralize from 'pluralize'
import Next from './helpers/next'

let Handler =  function (name, Model, searchItem = true, autocomplete = true) {
  this.name = name
  this.names = pluralize(name, 2)
  let {nextItem, nextItems} = new Next(this.name)
  let handler = {
    getItem: (req, res, next) => Model.getItem(req.params.id, (err, item) => nextItem(err, item, res, next)),
    searchItems: (req, res, next) => Model.searchItem(req.query[name] || req.body[name], (err, items) => nextItems(err, items, res, next)),
    getRandom: (req, res, next) => Model.getRandom((err, item) => nextItem(err, item, res, next)),
    getAll: (req, res, next) => Model.getAll(items => nextItems(null, items, res, next)),
    addItems: (req, res, next) => Model.addArray(req.body[this.names], (err, items) => nextItems(err, items, res, next)),
    addItem: (req, res, next) => Model.addItem(req.body[this.name] || req.body.name || req.body, (err, item) => nextItem(err, item, res, next)),
    updateItem: (req, res, next) => Model.updateItem(req.params.id, req.body, (err, item) => nextItem(err, item, res, next)),
    removeArray: (req, res, next) => Model.removeArray(req.body[this.names], err => res.send({ok: err || true})),
    removeItem: (req, res, next) => Model.removeItem(req.params.id, err => res.send({ok: err || true})),
    removeAll: (req, res, next) => Model.removeItem(null, err => res.send({ok: err || true})),
    getCount: (req, res, next) => Model.getCount((err, count) => res.send({count})),
    autocomplete: (req, res, next) => Model.autocomplete(req.query[name], (err, items) => nextItems(err, items, res, next)),
    sendItem: (req, res, next) => res.send({[this.name]: res[this.name]}),
    sendItems: (req, res, next) => res.send({[this.names]: res[this.names]})
  }
  !autocomplete && (delete handler.autocomplete)
  !searchItem && (delete handler.searchItem)
  return handler
}

export default Handler
