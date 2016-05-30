import async from 'async'

export default function (data, cb) {
  if (!data) return cb()
  async.reduce(data, [], (memo, item, callback) => {
    this.addItem(item, (err, res) => {
      memo.push(res)
      callback(err, memo)
    })
  }, cb)
}
