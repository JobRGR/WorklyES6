export default function (id, callback) {
  if (id) this.findByIdAndRemove(id, callback)
  else this.remove({}, callback)
}
