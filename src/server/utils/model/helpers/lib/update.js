import mongoose from 'mongoose'

export default function (id, update, callback, objects = []) {
  objects.forEach(key => {
    if (typeof update[key] != 'string') {
      delete update[key]
    }
    else if (!mongoose.Types.ObjectId.isValid(update[key])) {
      delete update[key]
    }
  })
  this.findById(id, (err, item) => {
    if (err) return callback(err)
    for (let key in  update){
      if (update[key] != undefined){
        item[key] = objects.indexOf(key) > -1 ? mongoose.Types.ObjectId(update[key]) : update[key]
      }
    }
    item.save(err => callback(err, item))
  })
}
