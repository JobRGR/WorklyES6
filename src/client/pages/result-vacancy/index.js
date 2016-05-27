import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import {Card, CardTitle} from 'material-ui/Card'
import {getVacancy} from '../feed/utils'
import VacancyApi from '../../../client_api/api/vacancy'

const defaultState = {
  loading: false,
  error: false,
  vacancy: null
}


export default class extends Component {
  constructor() {
    super()
    this.state = {...defaultState}
  }

  componentWillMount() {
    this.setState({loading: true})
    VacancyApi
      .getItem(this.props.params.id)
      .then(({status, data}) => {
        if (status != 200 || !data.vacancy) throw data
        this.setState({...defaultState, vacancy: data.vacancy})
      })
      .catch(_ => this.setState({...defaultState, error: true}))
  }

  render() {
    const testsNumber = (
      this.state.vacancy
      ? this.state.vacancy.openQuestions.length + this.state.vacancy.testQuestions.length
      : 0
    )
    return (
      <div className='result-vacancy-list'>
        <Card>
          <CardTitle title='Результати тестування' subtitle={this.state.vacancy ? `Кількість тестів: ${testsNumber}` : ''} />
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Ім'я</TableHeaderColumn>
                <TableHeaderColumn>Місто</TableHeaderColumn>
                <TableHeaderColumn>Позиція</TableHeaderColumn>
                <TableHeaderColumn>Правильно</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody showRowHover={true} stripedRows={false} displayRowCheckbox={false}>
              {
                this.state.vacancy &&
                this.state.vacancy.testsResults
                  .sort((a, b) => -(a.correct - b.correct))
                  .map(({student, correct}) =>
                    <TableRow
                      key={student._id}
                      onTouchTap={() => browserHistory.push(`/student/${student._id}`)}
                      style={{cursor: 'pointer'}}
                    >
                      <TableRowColumn>{student._id}</TableRowColumn>
                      <TableRowColumn>{student.name}</TableRowColumn>
                      <TableRowColumn>{student.city ? student.city.name : '–'}</TableRowColumn>
                      <TableRowColumn>{student.experiences ? getVacancy(student.experiences) : '–'}</TableRowColumn>
                      <TableRowColumn>{correct}</TableRowColumn>
                    </TableRow>
                  )
              }
            </TableBody>
          </Table>
        </Card>
      </div>
    )
  }
}