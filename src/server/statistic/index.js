"use strict";

import fs from 'fs'
import path from 'path'

class Statistic {
  constructor() {
    this.data = fs
      .readFileSync(path.resolve(__dirname, '../../../express_server.log'), 'utf8')
      .split('\n')
      .filter(item => item.length)
      .map(item => {
        [item] = item.split(' "-" "node-superagent/1.3.0"')
        let [ip, other] = item.split(' - - [')
        let [date, req] = other.split('] ')
        let [type, url, version, status, time] = req.split(' ')
        type = type.substr(1)
        version = version.substring(0, version.length - 1)
        return {ip, date, req: {type, url, version, status, time}}
      })
  }

  checkDate({min = new Date(0, 0, 0), max = new Date()}, date) {
    return date >= min && date <= max
  }

  getItem(name = '', options = {}) {
    let {status, url, type, ip, date, time} = options
    return this.data.filter(item => {
      let {req} = item
      return req.url.indexOf(name) > -1
        && (status ? parseInt(req.status) == parseInt(status) : true)
        && (url ? req.url.indexOf(url) > -1 : true)
        && (type ? req.type.toLowerCase() == type.toLowerCase() : true)
        && (ip ? item.ip == ip : true)
        && (date ? this.checkDate(date, new Date(item.date)) : true)
        && (time ? item.time >= time.min && item.time <= time.max : true)
    })
  }

  getCount(name, options) {
    let cur = this.getItem(name, options)
    return cur.length * 100 / this.data.length
  }

  getCountType(name, options) {
    let cur = this.getItem(name, options)
    let all = this.getItem(name)
    return cur.length * 100 / all.length
  }
}

export default Statistic