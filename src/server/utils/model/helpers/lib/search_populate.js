export default function (search, callback, [firstType, secondType], sort = {'start': 1}) {
  this
    .find(search)
    .populate(firstType)
    .populate(secondType)
    .sort(sort)
    .exec(callback)
}