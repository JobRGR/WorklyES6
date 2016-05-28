import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import Avatar from 'material-ui/Avatar'
import dateFormat from 'dateformat'


class AvatarName extends Component {
  navigate = (path) => browserHistory.push(path)

  render() {
    const letters = this.props.name
      .trim()
      .split(' ')
      .splice(0, 2)
      .map(x => x.charAt(0))
      .join('')
      .toUpperCase()
    return (
      <div className='avatar-name'>
        {
          this.props.src
          ? <Avatar src={this.props.src} size={this.props.size} />
          : <Avatar size={this.props.size}>{letters}</Avatar>
        }
        {
          this.props.text
          ? this.props.text
          : <div className='avatar-name-info'>
            <h3 className='avatar-name-title'>{this.props.name}</h3>
            {
              this.props.companyName &&
              <div className='avatar-name-label'
                   onClick={() => this.navigate(`/company/${this.props.companyId}`)}>
                {this.props.companyName}
              </div>}
            {this.props.city && <span className='avatar-name-subtitle'>{this.props.city}</span>}
            {this.props.city && this.props.dob && <span className='avatar-name-delim'>|</span>}
            {this.props.dob &&
            <span className='avatar-name-subtitle'>{dateFormat(new Date(this.props.dob), "mmmm dS, yyyy")}</span>}
          </div>
        }
      </div>
    )
  }
}

AvatarName.defaultProps = {
  size: 120,
  src: null,
  name: 'Mister X'
}

export default AvatarName