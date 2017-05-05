export default function (id, callback, foreignKeys, sort = {'start': 1}, skip = 0, limit = 100) {
  if (id) this
    .findById(id)
    .populate(foreignKeys)
    .exec(callback)
  else this
    .find({})
    .skip(skip)
    .limit(limit)
    .populate(foreignKeys)
    .sort(sort)
    .exec(callback)
}