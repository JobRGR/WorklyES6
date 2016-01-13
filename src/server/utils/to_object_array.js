import mongoose from 'mongoose'

export default arr => arr.map(({_id}) => mongoose.Types.ObjectId(_id))