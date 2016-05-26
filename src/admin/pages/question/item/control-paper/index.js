import React from 'react'
import Paper from 'material-ui/Paper'
import Open from './open'
import Test from './test'

export default React.createClass({

  getInitialState() {
    return {
      top: 0,
      maxHeight: document.documentElement.clientHeight - this.props.initTop,
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
    let maxHeight = document.documentElement.clientHeight
    if (top > 0) {
      this.state.maxHeight == maxHeight ? this.setState({top}) : this.setState({top, maxHeight})
    }
    else {
      maxHeight += top
      this.setState({top: 0, maxHeight})
    }
  },

  render() {
    const props = {
      name: this.props.name,
      item: this.props.item,
      Api: this.props.Api
    }
    return (
      <Paper className='control-paper' style={{top: this.state.top, maxHeight: this.state.maxHeight}}>
        {
          this.props.name == 'open-questions' ?
            <Open {...props} /> :
            <Test {...props} />
        }
      </Paper>
    )
  }
})
