export default function (items, cb, key = '_id') {
  this.remove({[key]: {$in: items}}, cb)
}