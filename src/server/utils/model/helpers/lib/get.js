export default function (id, callback, skip = 0, limit = 100) {
  if (id)
    this.findById(id, callback)
  else
    this
      .find({})
      .skip(skip)
      .limit(limit)
      .sort({'name': 1})
      .exec(callback)
}
