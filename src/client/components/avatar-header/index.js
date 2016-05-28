import React, {Component} from 'react'
import Avatar from 'material-ui/Avatar'


const textStyle = {
  display: 'inline-block',
  verticalAlign: 'middle',
  fontFamily: 'sans-serif',
  fontWeight: 400,
  fontSize: 18,
  color: '#ffffff',
  marginRight: 15
}

const downPointerStyle = {
  fontFamily: 'sans-serif',
  fontWeight: 700,
  fontSize: 16,
  color: '#fff',
  marginLeft: 12
}

class AvatarHeader extends Component {
  render() {
    const letters = this.props.name
      .trim()
      .split(' ')
      .splice(0, 2)
      .map(x => x.charAt(0))
      .join('')
      .toUpperCase()
    return (
      <div onClick={this.props.handleClick}
           className='header-avatar'>
        <span style={textStyle}>
          {this.props.name.trim().split(' ')[0]}
        </span>
        {
          this.props.src
          ? <Avatar src={this.props.src} size={this.props.size} style={{verticalAlign: 'middle'}} />
          : <Avatar size={this.props.size} style={{verticalAlign: 'middle'}}>{letters}</Avatar>
        }
        <span style={downPointerStyle}>▾</span>
      </div>
    )
  }
}

AvatarHeader.defaultProps = {
  size: 38,
  src: null,
  name: 'Mister X'
}

export default AvatarHeader