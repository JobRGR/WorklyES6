import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import Student from '../models/models'

let {nextItem, nextItems} = new Next('experience')
let handler = new Handler('student', Student, false, false)

export default handler
