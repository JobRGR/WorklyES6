import async from 'async'
import Next from '../utils/handler/helpers/next'
import Handler from '../utils/handler'
import {Student} from '../models/models'

let {nextItem, nextItems} = new Next('student')
let handler = new Handler('student', Student, false, false)

export default handler
