export default function (name, callback, skip = 0, limit = 100, type = 'name') {
  let search = Array.isArray(name) ? {$in: name} : name
  this
    .find({[type]: search})
    .skip(skip)
    .limit(limit)
    .exec(callback)
}
