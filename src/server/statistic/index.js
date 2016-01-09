"use strict";

import fs from 'fs'
import path from 'path'
import {checkDate, getRanges, monthList} from '../utils/date'

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
    this.apiList = ['student', 'company', 'city', 'skill', 'speciality', 'university', 'company-name', 'open-question', 'test-question', 'position']
  }

  getItem(name = '', options = {}) {
    let {status, url, type, ip, date, time, error} = options
    return this.data.filter(item => {
      let {req} = item
      return Array.isArray(name) ? name.some(x => req.url.indexOf(x) > -1) : req.url.indexOf(name) > -1
        && (status ? parseInt(req.status) == parseInt(status) : true)
        && (url ? req.url.indexOf(url) > -1 : true)
        && (type ? req.type.toLowerCase() == type.toLowerCase() : true)
        && (ip ? item.ip == ip : true)
        && (date ? checkDate(date, new Date(item.date)) : true)
        && (time ? item.time >= time.min && item.time <= time.max : true)
        && (error ? parseInt(parseInt(req.status) / 100) > 3 : true)
    })
  }

  getCount(name, options, isCount) {
    let cur = this.getItem(name, options)
    let percent =  cur.length * 100 / this.data.length
    return isCount ? {count: cur.length, percent} : percent
  }

  getCountType(name, options) {
    let cur = this.getItem(name, options)
    let all = this.getItem(name)
    return cur.length * 100 / all.length
  }

  graph(name, type) {
    let ranges = getRanges(type)
    return ranges.reduce((memo, {min, max}) => {
      let label = null
      let val = this.getItem(name, {date: {min, max}})
      if (type == 'year') label = monthList[min.getMonth()]
      else if (type == 'month') label = `${min.getDate()} ${monthList[min.getMonth()]}`
      else if (type == 'day') label = `${min.getHours() > 10 ? min.getHours() : `0${min.getHours() }` }:00`
      memo.labels.push(label)
      memo.series.push(val)
      return memo
    }, {labels: [], series: []})
  }

  pie(name, date) {
    let count = name.reduce((memo, cur) => {
      memo[cur].all = this.getCount(cur, {date}, true)
      memo[cur].error = this.getCount((cur, {date, error: true}, true))
      return memo
    }, {})
    count.other = types.reduce((memo, cur) => {
      memo.all.count -= cur.all.count
      memo.all.percent -= cur.all.percent
      memo.error.count -= cur.error.count
      memo.error.percent -= cur.error.percent
      return memo
    }, {
      all: {count: this.data.length, percent: 100},
      error: this.getCount('', {error: true}, true)
    })
    return count
  }
}

export default Statistic