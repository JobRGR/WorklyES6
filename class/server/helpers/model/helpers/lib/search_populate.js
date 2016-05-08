export default function (search, callback, foreignKeys, sort = {'start': 1}) {
  this
    .find(search)
    .populate(foreignKeys)
    .sort(sort)
    .exec(callback)
}