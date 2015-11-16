export default function (id, callback, [firstType, secondType], sort = {'start': 1}) {
  if (id) this
    .findById(id)
    .populate(firstType)
    .populate(secondType)
    .exec(callback)
  else this
    .find({})
    .populate(firstType)
    .populate(secondType)
    .sort(sort)
    .exec(callback)
}