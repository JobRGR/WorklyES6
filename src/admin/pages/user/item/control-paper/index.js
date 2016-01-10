import React from 'react'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'
import Loader from '../../../../components/loader'
import Paper from 'material-ui/lib/paper'

export default React.createClass({
  getInitialState() {
    return {
      top: 0
    }
  },

  componentWillMount() {
    window.addEventListener('scroll', this.handleScroll)
  },

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  handleScroll() {
    let top = document.body.scrollTop - this.props.initTop
    top > 0 ? this.setState({top}): this.setState({top: 0})
  },

  render() {
    return (
      <Paper className='control-paper' style={{top: this.state.top}}>
        Edit + Add Panel
      </Paper>
    )
  }
})
