import express from 'express'
import bodyParser from 'body-parser'
import config from './config'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import logger from 'express-logger'
import ejs from 'ejs'
import lusca from 'lusca'
import routes from './routes'
import authLoader from './middleware/auth_loader'

const port = process.env.PORT || config.port
let app = express()

app
  .engine('html', ejs.renderFile)
  .use(express.static(`${__dirname}/../../dist/`))
  .use(express.static(`${__dirname}/node_modules/`))
  .use(logger({path: 'express_server.log'}))
  .use(bodyParser.urlencoded({limit: '50mb', extended: false}))
  .use(bodyParser.json({limit: '50mb'}))
  .use(cookieParser())
  .use(morgan('dev'))
  .use(lusca(config.security))
  .use(authLoader)
  .use(routes)
  .listen(port)

console.log(`[server]:${port}`)
