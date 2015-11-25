export default function (name, callback, type = 'name') {
  let search = Array.isArray(name) ? {$in: name} : name
  this.find({[type]: search}, callback)
}
