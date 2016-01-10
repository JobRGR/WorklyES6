import newrelicConfig from '../newrelic'

export default () => {
  process.env.NEW_RELIC_APP_NAME = newrelicConfig.app_name
  process.env.NEW_RELIC_LICENSE_KEY = newrelicConfig.licence_key
  process.env.NEW_RELIC_LOG_LEVEL = newrelicConfig.logging.level
  return false
}