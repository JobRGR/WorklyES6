export default function (name, callback, type = 'name') {
  this.findOne({[type]: name}, callback)
}
