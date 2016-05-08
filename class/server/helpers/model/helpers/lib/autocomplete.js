export default function (name, callback, type = 'name') {
  this
    .find({[type]: new RegExp(`.*${name}.*`, 'i')})
    .sort({'date': -1})
    .limit(20)
    .exec(callback)
}
