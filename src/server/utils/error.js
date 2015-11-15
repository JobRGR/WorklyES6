import http from 'http'

class ExtendableError extends Error {
  constructor(status, message) {
    super()
    this.status = status
    this.message = message || http.STATUS_CODES[status] || 'Error'
    this.stack = (new Error()).stack
    this.name = this.constructor.name
  }
}

class HttpError extends ExtendableError {
  constructor(status, message) {
    super(status, message)
  }
}

export default HttpError