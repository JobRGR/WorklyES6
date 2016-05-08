export default function (id, callback, foreignKeys, sort = {'start': 1}) {
  if (id) this
    .findById(id)
    .populate(foreignKeys)
    .exec(callback)
  else this
    .find({})
    .populate(foreignKeys)
    .sort(sort)
    .exec(callback)
}