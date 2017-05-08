import async from 'async'

export default (Module, data, cb) => {
  Module.removeItem(null, () => {
    async.each(data, (name, callback) => {
      Module.addItem(name, (err, item) => {
        err && console.log('[Error]:', err, item)
        callback()
      })
    }, err => {
      console.log(err || 'Successfully save data!')
      cb(err)
    })
  })
}
