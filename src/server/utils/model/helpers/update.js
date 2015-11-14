export default function (id, update, callback) {
  this.findById(id, (err, item) => {
    if (err) return callback(err)
    for (let key in  update)
      if (update[key])
        item[key] = update[key]
    item.save(err => callback(err, item))
  })
}
