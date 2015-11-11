import async from 'async'

export default (Module, data, cb) => {
  Module.removeItem(null, () => {
    async.each(data, (name, callback) => {
      Module.addItem(name, (err, item) => {
        console.log(item)
        callback()
      })
    }, err => cb(err))
  })
}
