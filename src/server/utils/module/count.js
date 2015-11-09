export default function (callback) {
  this.count({}, (err, count) => callback(count))
}
