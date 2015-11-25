export default function (id, callback, populate, sort = {'start': 1}) {
  if (id) this
    .findById(id)
    .populate(populate)
    .exec(callback)
  else this
    .find({})
    .populate(populate)
    .sort(sort)
    .exec(callback)
}