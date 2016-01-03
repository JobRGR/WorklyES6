import React from 'react'
import TextField from 'material-ui/lib/TextField/TextField'
import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog'
import capitalize from '../../../tools/capitalize'


export default React.createClass({

  render() {
    const name = capitalize(this.props.name.toLowerCase())
    return (
      <Dialog
        title={`Edit ${name}`}
        actions={[
          <FlatButton
            label='Cancel'
            secondary={true}
            onTouchTap={() => this.props.handleEdit()} />,
          <FlatButton
            label='Update'
            primary={true}
            keyboardFocused={true}
            onTouchTap={this.props.saveEdit} />
        ]}
        modal={false}
        open={this.props.edit ? true : false}
        onRequestClose={() => this.props.handleEdit}
      >
        <TextField
          hintText={`Edit ${name}`}
          floatingLabelText='Edit'
          inputStyle={{marginLeft: 5}}
          hintStyle={{marginLeft: 5}}
          floatingLabelStyle={{marginLeft: 5}}
          fullWidth
          value={this.props.edit ? this.props.edit.name : ''}
          onChange={this.props.handleEditItem}
        />
      </Dialog>
    )
  }
})
