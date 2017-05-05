const ddg = require('ddg')

export default (val, cb) => {
  try {
    ddg.query(val, function (err, data) {
      cb(data && data.Image.length ? data.Image : null)
    })
  }
  catch (err) {
    cb(null)
  }
}
