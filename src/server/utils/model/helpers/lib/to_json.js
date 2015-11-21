export default function() {
  let item = this.toObject()
  delete item.hashedPassword
  delete item.salt
  return item
}
