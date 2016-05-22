import React from 'react'
import {Link, browserHistory} from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'


export default class extends React.Component {

  navigate = () => {
    let path = document.location.pathname.indexOf('admin') > -1 ? '/admin' : '/'
    browserHistory.push(path)
  }

  render() {
    let className='oops'
    return (
      <div className={className}>
        <div className='oops-error'>
          <img src='/client/img/sad-walk.gif' />
        </div>
        <span className={`${className}-title`}>Oops!</span>
        <span className={`${className}-sub`}>
          We can't seem to find the<br />
          page you're looking for.
        </span>
        <RaisedButton label='Choose correct a one' onTouchTap={this.navigate} secondary={true} />
      </div>
    )
  }
}