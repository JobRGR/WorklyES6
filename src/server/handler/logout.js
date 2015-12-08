export default (req, res, next) => {
  req.session.destroy(err => {
    if (err) return next(err)
    return res.send({logout: true});
  })
}