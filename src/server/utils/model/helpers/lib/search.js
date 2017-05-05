export default function (name, callback, type = 'name', skip = 0, limit = 100) {
  let search = Array.isArray(name) ? {$in: name} : name
  this
    .find({[type]: search})
    .skip(skip)
    .limit(limit)
    .exec(callback)
}
