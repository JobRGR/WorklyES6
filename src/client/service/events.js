import {EventEmitter} from 'events'

class Events extends EventEmitter {
  constructor() {
    super()
  }

  onLoaded(cb) {
    this.on('loaded', cb)
  }

  onError(cb) {
    this.on('error', cb)
  }

  onLoading(cb) {
    this.on('loading', cb)
  }

  removeLoadedListener(cb) {
    this.removeListener('loaded', cb)
  }

  removeErrorListener(cb) {
    this.removeListener('error', cb)
  }

  removeLoadingListener(cb) {
    this.removeListener('loading', cb)
  }
}

export default Events


