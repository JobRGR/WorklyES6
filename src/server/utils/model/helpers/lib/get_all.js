import async from 'async'

const limit = 100

export default function (cb) {
  let data = []
  this.count({}, (err, count) => {
    let loop = []
    let lastSkip = Math.ceil(count / limit)
    for (let i = 0; i <= lastSkip; i++) {
      loop.push(callback => {
        this
          .find({})
          .skip(i * limit)
          .limit(limit)
          .exec((err, res) => {
            !err && data.push(...res)
            callback()
          })
      })
    }
    async.waterfall(loop, () => {
      cb(data)
    })
  })
}
