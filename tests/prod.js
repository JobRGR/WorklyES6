import config from '../src/server/config'
process.env.url = config.url
require('./server/index.js')