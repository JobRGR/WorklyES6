import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import logger from 'express-logger'
import ejs from 'ejs'
import routes from './routes'
import initProcess from './init/process'
import session from './utils/session_store'
import errorHandler from './middleware/error_handler'
import authLoader from './middleware/auth_loader'

const port = process.env.PORT || 3333
let app = express()

!process.env.test && initProcess() && require('newrelic')

app
  .engine('html', ejs.renderFile)
  .use(express.static(`${__dirname}/../../dist/`))
  .use(express.static(`${__dirname}/node_modules/`))
  .use(logger({path: 'express_server.log'}))
  .use(bodyParser.urlencoded({limit: '50mb', extended: false}))
  .use(bodyParser.json({limit: '50mb'}))
  .use(cookieParser())
  .use(morgan('dev'))
  .use(session)
  .use(authLoader)
  .use(routes)
  .use(errorHandler)
  .listen(port)

console.log(`[server]:${port}`)
