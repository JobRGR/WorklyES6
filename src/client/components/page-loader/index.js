import React, {Component} from 'react'
import Spinner from '../spinner'

export default class extends Component {
  render() {
    return (
      <div className='page-loader'>
        <div className='center-block'>
          <h1>WORKLY</h1>
          <Spinner />
        </div>
      </div>
    )
  }
}