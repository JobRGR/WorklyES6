export default (err, req, res, next) => {
  (!err.status || err.status == 500) && console.log(err.stack)
  res
    .status(err.status || 500)
    .send({message: err.message, err})
}