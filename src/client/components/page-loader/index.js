import React, {Component} from 'react'
import Spinner from '../spinner'
import {green500} from 'material-ui/styles/colors'

export default class extends Component {
  render() {
    return (
      <div className='page-loader'>
        <div className='center-block'>
          <h1>WORKLY</h1>
          <Spinner bounceStyle={{backgroundColor: green500}} />
        </div>
      </div>
    )
  }
}