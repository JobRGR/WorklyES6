import React, {Component} from 'react'
import Avatar from 'material-ui/Avatar'
import dateFormat from 'dateformat'


class AvatarName extends Component {
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
        <div className='avatar-name-info'>
          <h3 className='avatar-name-title'>{this.props.name}</h3>
          {this.props.city && <span className='avatar-name-subtitle'>{this.props.city}</span>}
          {this.props.city && this.props.dob && <span className='avatar-name-delim'>|</span>}
          {this.props.dob && <span className='avatar-name-subtitle'>{dateFormat(new Date(this.props.dob), "mmmm dS, yyyy")}</span>}
        </div>
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