import React, {Component} from 'react'
import VacancyApi from '../../../client_api/api/vacancy'
import {browserHistory} from 'react-router'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardMedia, CardTitle} from 'material-ui/Card'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit'
import Results from 'material-ui/svg-icons/navigation/menu'
import Delete from 'material-ui/svg-icons/action/delete'

const defaultState = {
  loading: false,
  error: false,
  vacancies: [],
  open: false
}

export default class extends Component {
  constructor() {
    super()
    this.state = {...defaultState}
  }

  componentWillMount() {
    this.setState({loading: true})
    VacancyApi
      .searchItems({companyName: this.props.item.name.name})
      .then(({status, data}) => {
        if (status != 200 || !data.vacancies) {
          throw data
        }
        this.setState({...defaultState, vacancies: data.vacancies})
      })
      .catch(_ => this.setState({...defaultState, error: true}))
  }

  remove(id) {
    this.setState(({vacancies}) => ({
      vacancies: vacancies.filter(({_id}) => _id != id),
      removeVacancy: vacancies.filter(({_id}) => _id == id)[0],
      beforeList: vacancies,
      open: true
    }))
  }


  handleActionTouchTap() {
    this.setState(({beforeList}) => ({
      vacancies: beforeList,
      removeVacancy: null,
      beforeList: [],
      open: false
    }))
  }

  handleRequestClose() {
    this.setState(({removeVacancy}) => {
      removeVacancy && VacancyApi
        .removeItem(this.state.removeVacancy._id)
        .then(({status, data}) => this.setState({removeVacancy: null, open: false}))
      return removeVacancy
    })
  }

  render() {
    return (
      <div className='vacancy-list'>
        <Card>
          {
            this.props.item.avatar
            ? <CardMedia
              overlay={<CardTitle title='Відкритті вакансії' subtitle={this.props.item.name.name} />}
            >
              <img src={this.props.item.avatar}/>
            </CardMedia>
            : < CardTitle title='Відкритті вакансії' subtitle={this.props.item.name.name} />
          }
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Позиція</TableHeaderColumn>
                <TableHeaderColumn>Місто</TableHeaderColumn>
                <TableHeaderColumn style={{width: '15%'}}>Результати</TableHeaderColumn>
                <TableHeaderColumn style={{width: '15%'}}>Редагувати</TableHeaderColumn>
                <TableHeaderColumn style={{width: '15%'}}>Видалити</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false}>
              {
                this.state.vacancies.map(item =>
                  <TableRow key={item._id}>
                    <TableRowColumn onTouchTap={() => browserHistory.push(`/feed/${item._id}`)} style={{cursor: 'pointer'}}>
                      {item._id}
                    </TableRowColumn>
                    <TableRowColumn onTouchTap={() => browserHistory.push(`/feed/${item._id}`)} style={{cursor: 'pointer'}}>
                      {item.name}
                    </TableRowColumn>
                    <TableRowColumn onTouchTap={() => browserHistory.push(`/feed/${item._id}`)} style={{cursor: 'pointer'}}>
                      {item.city ? item.city.name : '–'}
                    </TableRowColumn>
                    <TableRowColumn style={{width: '15%'}}>
                      <IconButton onTouchTap={() => {}}><Results /></IconButton>
                    </TableRowColumn>
                    <TableRowColumn style={{width: '15%'}}>
                      <IconButton onTouchTap={() => browserHistory.push(`/vacancy/edit/${item._id}`)}><ModeEdit /></IconButton>
                    </TableRowColumn>
                    <TableRowColumn style={{width: '15%'}}>
                      <IconButton onTouchTap={() => this.remove(item._id)}><Delete /></IconButton>
                    </TableRowColumn>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </Card>
        <Snackbar
          open={this.state.open}
          message={'Повернути компанію'}
          action='undo'
          autoHideDuration={4000}
          onActionTouchTap={() => this.handleActionTouchTap()}
          onRequestClose={() => this.handleRequestClose()}
        />
      </div>
    )
  }
}