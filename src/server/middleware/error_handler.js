export default (err, req, res, next) =>
  res
    .status(err.status || 500)
    .send({message: err.message, err})