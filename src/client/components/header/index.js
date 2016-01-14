import React from 'react'
import AppBar from 'material-ui/lib/app-bar'

export default React.createClass({
  render() {
    return (
      <AppBar
        title={<span className='header-logo'>Workly</span>}
        iconClassNameRight='muidocs-icon-navigation-expand-more'
      />
    )
  }
})