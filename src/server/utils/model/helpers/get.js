export default function (id, callback) {
  if (id)
    this.findById(id, callback)
  else
    this
      .find({})
      .sort({'name': 1})
      .exec(callback)
}
