export default function(callback, [firstType, secondType]) {
  this.count((err, count) => {
    if (err) return callback(err)
    const skip = Math.floor(Math.random() * count)
    this
      .findOne()
      .skip(skip)
      .populate(firstType)
      .populate(secondType)
      .exec(callback)
  })
}
