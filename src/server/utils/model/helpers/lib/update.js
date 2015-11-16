import mongoose from 'mongoose'

export default function (id, update, callback, objects = []) {
  this.findById(id, (err, item) => {
    if (err) return callback(err)
    for (let key in  update)
      if (update[key])
        item[key] = objects.indexOf(key) > -1 ? mongoose.Types.ObjectId(update[key]) : update[key]
    item.save(err => callback(err, item))
  })
}
