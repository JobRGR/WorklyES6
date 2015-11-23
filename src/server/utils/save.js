import jwt from 'jsonwebtoken'
import config from '../config'

export default (data, res) => {
  let token = jwt.sign(data, config.secret, {expiresIn: 60 * 60 * 24 * 7 * 30})
  res.cookie('token', token)
  return token
}