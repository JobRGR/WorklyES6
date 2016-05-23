import React, {Component} from 'react'
import Avatar from 'material-ui/Avatar'


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
      <div>
        {
          this.props.src
          ? <Avatar src={this.props.src} size={this.props.size} />
          : <Avatar size={this.props.size}>{letters}</Avatar>
        }
        <h3 style={{fontFamily: 'sans-serif', fontWeight: 400, fontSize: 24, display: 'inline-block', marginLeft: 20}}>
          {this.props.name}
        </h3>
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