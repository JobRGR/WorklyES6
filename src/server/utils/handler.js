import pluralize from 'pluralize'

let Handler = function (name, Module) {
  this.name = name
  this.names = pluralize(name, 2)

  return {
    getItem: (req, res, next) => Module.getItem(req.params.id, item => res.send({[this.name]: item})),
    searchItem: (req, res, next) => Module.searchItem(req.query[name], item => res.send({[this.name]: item})),
    getRandom: (req, res, netx) => Module.getRandom(item => res.send({[this.name]: item})),
    getAll: (req, res, next) => Module.getItem(null, items => res.send({[this.names]: items})),
    addItem: (req, res, next) => Module.addItem(req.body.name, (err, item) => res.send({[this.name]: item})),
    updateItem: (req, res, next) => Module.updateItem(req.params.id, {name: req.body.name}, (err, item) => res.send({[this.name]: item})),
    removeItem: (req, res, next) => Module.removeItem(req.params.id, err => res.send({ok: err || true})),
    removeAll: (req, res, next) => Module.removeItem(null, err => res.send({ok: err || true})),
    getCount: (req, res, next) => Module.getCount(count => res.send({count})),
    autocomplete: (req, res, next) => Module.autocomplete(req.query[name], items => res.send({[this.names]: items}))
  }
}

export default Handler