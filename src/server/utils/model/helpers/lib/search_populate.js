export default function (search, callback, foreignKeys, sort = {'start': 1}, skip = 0, limit = 100) {
  this
    .find(search)
    .skip(skip)
    .limit(limit)
    .populate(foreignKeys)
    .sort(sort)
    .exec(callback)
}