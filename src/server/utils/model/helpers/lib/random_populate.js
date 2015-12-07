export default function(callback, foreignKeys) {
  this.count((err, count) => {
    if (err) return callback(err)
    const skip = Math.floor(Math.random() * count)
    this
      .findOne()
      .skip(skip)
      .populate(foreignKeys)
      .exec(callback)
  })
}
