export default function (id, callback) {
  if (id)
    this.findById(id, (err, item) => callback(item))
  else
    this
      .find({})
      .sort({'name': 1})
      .exec((err, items) => callback(items))
}