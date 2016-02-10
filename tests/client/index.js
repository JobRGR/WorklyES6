import {jsdom} from 'jsdom'
import startPage from './spec/app/pages/index/index'

global.document = jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView

startPage()

