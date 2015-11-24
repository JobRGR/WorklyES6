import pluralize from 'pluralize'
import Next from './helpers/next'

let Handler = function (name, Model, searchItem = true, autocomplete = true) {
  this.name = name
  this.names = pluralize(name, 2)
  let {nextItem, nextItems} = new Next(this.name)
  let handler = {
    getItem: (req, res, next) => Model.getItem(req.params.id, (err, item) => nextItem(err, item, req, next)),
    searchItems: (req, res, next) => Model.searchItem(req.query[name] || req.body[name], (err, items) => nextItems(err, items, req, next)),
    getRandom: (req, res, next) => Model.getRandom((err, item) => nextItem(err, item, req, next)),
    getAll: (req, res, next) => Model.getItem(null, (err, items) => nextItems(err, items, req, next)),
    addItem: (req, res, next) => Model.addItem(req.body, (err, item) => nextItem(err, item, req, next)),
    updateItem: (req, res, next) => Model.updateItem(req.params.id, req.body, (err, item) => nextItem(err, item, req, next)),
    removeItem: (req, res, next) => Model.removeItem(req.params.id, err => res.send({ok: err || true})),
    removeAll: (req, res, next) => Model.removeItem(null, err => res.send({ok: err || true})),
    getCount: (req, res, next) => Model.getCount((err, count) => res.send({count})),
    autocomplete: (req, res, next) => Model.autocomplete(req.query[name], (err, items) => nextItems(err, items, req, next)),
    sendItem: (req, res, next) => res.send({[this.name]: req[this.name]}),
    sendItems: (req, res, next) => res.send({[this.names]: req[this.names]})
  }
  !autocomplete && (delete handler.autocomplete)
  !searchItem && (delete handler.searchItem)
  return handler
}

export default Handler
