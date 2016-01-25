import React from 'react'
import Paper from 'material-ui/lib/paper'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'
import Loader from '../../../components/loader'
import Remove from '../../dictionary/item/remove'
import Table from './table'
import ControlPaper from './control-paper'

export default React.createClass({
  getInitialState() {
    return {
      items: this.props.Api.cachedItems,
      item: null,
      loading: false,
      error: null,
      count: 20,
      search: '',
      value: 0
    }
  },

  componentWillMount() {
    this.props.Api.onLoaded(this.onLoaded)
    this.props.Api.onLoading(this.onLoading)
    this.props.Api.onError(this.onError)
    !this.state.items.length && this.props.Api.loadAll()
  },

  componentWillUnmount() {
    this.props.Api.removeErrorListener(this.onError)
    this.props.Api.removeLoadingListener(this.onLoading)
    this.props.Api.removeLoadedListener(this.onLoaded)
  },

  onError(error) {
    this.setState({error, loading: false})
  },

  onLoaded(items) {
    this.setState({items, loading: false})
  },

  onLoading() {
    this.setState({loading: true})
  },

  handleSearch(event) {
    event.preventDefault()
    event.stopPropagation()
    this.setState({search: event.target.value, count: 20})
  },

  handleRemove(id) {
    this.refs.remove.handleRemove(id)
  },

  handleEdit(item) {
    this.setState({value: -100, item: item})
  },

  handleCancel() {
    this.setState({value: 0, item: null})
  },

  render() {
    const style = {
      position: 'relative',
      boxSizing: 'border-box',
      left: this.state.value + '%',
      width: '200%',
      transition: 'left 0.5s ease-out'
    }
    return (
      <div style={style}>
        <Paper style={{display: 'inline-block', width: '49%', margin: '3px 0.5%'}}>
          <div style={{height: 100}}>
            <TextField
              hintText={`search ${this.props.name.toLowerCase()} by title`}
              floatingLabelText={`Search ${this.props.name.toLowerCase()}`}
              inputStyle={{marginLeft: 5}}
              hintStyle={{marginLeft: 5}}
              floatingLabelStyle={{marginLeft: 5}}
              style={{width: '96%', margin: '0 2%'}}
              onChange={this.handleSearch} />
          </div>
          {
            this.state.loading &&
            <div style={{boxSizing: 'border-box', height: '130px', width: '100%'}}>
              <Loader />
            </div>
          }
          {
            !this.state.loading && this.state.items.length > 0 &&
            <Table
              ref='table'
              name={this.props.name}
              search={this.state.search}
              items={this.state.items}
              count={this.state.count}
              handleRemove={this.handleRemove}
              handleEdit={this.handleEdit}
              handleMore={() => this.setState(({count}) => ({count: count + 20}))}/>
          }
          <Remove name={this.props.name} Api={this.props.Api} ref='remove' />
        </Paper>
        <Paper style={{display: 'inline-block', width: '49%', verticalAlign: 'top',  margin: '3px 0.5%'}}>
          {
            this.state.item &&
            <ControlPaper name={this.props.name}
                          Api={this.props.Api}
                          item={this.state.item}
                          handleCancel={this.handleCancel} />
          }
        </Paper>
      </div>
    )
  }
})
