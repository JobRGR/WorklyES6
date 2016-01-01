import React from 'react'
import AppBar from 'material-ui/lib/app-bar'

export default React.createClass({
  render() {
    return (
      <AppBar
        title='Admin'
        iconClassNameRight='muidocs-icon-navigation-expand-more'
      />
    )
  }
})