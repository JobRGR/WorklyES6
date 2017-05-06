export default function (search, callback, foreignKeys, skip = 0, limit = 100, sort = {'start': 1}) {
  this
    .find(search)
    .skip(skip)
    .limit(limit)
    .populate(foreignKeys)
    .sort(sort)
    .exec(callback)
}