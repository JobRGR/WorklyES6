import React from 'react'
import SignInUp from '../../components/sign-in-up'


export default class extends React.Component {
  render() {
    return (
      <div className='index'>
        <div className='index-head'>
          <span className='index-logo'>Workly</span>
          <div className='index-bg'></div>
          <div className='index-text'>
            <h1>WELCOME</h1>
          </div>
        </div>
        <SignInUp />
      </div>
    )
  }
}
