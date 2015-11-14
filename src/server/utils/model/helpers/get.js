export default function (id, callback) {
  if (id)
    this.findById(id, (err, item) => callback(err, item))
  else
    this
      .find({})
      .sort({'name': 1})
      .exec((err, items) => callback(err, items))
}