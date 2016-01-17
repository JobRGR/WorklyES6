import React from 'react'
import CircularProgress from 'material-ui/lib/circular-progress'

export default React.createClass({
  render () {
    return (
      <CircularProgress
        mode='indeterminate'
        size={1.5}
        style={{
          position: this.props.absolute ? 'absolute' : 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          margin: 0
        }}
      />
    )
  }
})