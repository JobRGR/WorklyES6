import React, {Component} from 'react'
import {Card, CardHeader, CardText, CardActions} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Divider from 'material-ui/Divider'
import AvatarName from '../../components/avatar-name'
import dateFormat from 'dateformat'
import getResume from '../../tools/get-resume'


const buttonStyle = {
  textTransform: 'none',
  fontFamily: 'sans-serif',
  fontSize: 18
}

export default class extends Component {
  render() {
    const telephone = (this.props.item.telephone || '')
      .replace(/[^0-9]/g, '')

    return (
      <div className='view-user'>
        <div className='view-user_left-side'>
          <AvatarName src={this.props.item.avatar}
                      name={this.props.item.name}
                      city={this.props.item.city && this.props.item.city.name}
                      dob={this.props.item.dob} />
          {
            this.props.item.about &&
            <div className='student-about'>{this.props.item.about}</div>
          }
          {
            this.props.item.skills.map((skill) => (
              <div key={skill._id} className='skill-item'>{skill.name}</div>
            ))
          }
          {
            this.props.item.educations.length && [
              <div className='student-subtitle'>Освіта</div>,
              <Divider/>,
              ...this.props.item.educations.map(education => [
                <div key={education._id} className='student-item'>
                  <div style={{fontWeight: 'bold'}}>{education.speciality.name}</div>
                  <div style={{marginTop: 5}}>{education.university.name}</div>
                  <div className='student-dates'>
                    {education.start && <span>з {dateFormat(new Date(education.start), "mmmm dS, yyyy")}</span>}
                    {education.end && <span> по {dateFormat(new Date(education.end), "mmmm dS, yyyy")}</span>}
                  </div>
                </div>,
                <Divider/>
              ])
            ]
          }
          {
            this.props.item.experiences.length && [
              <div className='student-subtitle'>Досвід роботи</div>,
              <Divider/>,
              ...this.props.item.experiences.map(experience => [
                <div key={experience._id} className='student-item'>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div style={{fontWeight: 'bold'}}>{experience.position.name}</div>
                    <div style={{fontStyle: 'italic'}}>{experience.companyName.name}</div>
                  </div>
                  <div style={{marginTop: 5}}>{experience.about}</div>
                  <div className='student-dates'>
                    {experience.start && <span>з {dateFormat(new Date(experience.start), "mmmm dS, yyyy")}</span>}
                    {experience.end && <span> по {dateFormat(new Date(experience.end), "mmmm dS, yyyy")}</span>}
                  </div>
                </div>,
                <Divider/>
              ])
            ]
          }
        </div>
        <div className='view-user_right-side'>
          <Card>
            <CardHeader
              title={'Зв\'язатись з кандидатом'}
              titleStyle={{fontFamily: 'sans-serif', fontWeight: 700, fontSize: 18}}
              actAsExpander={true}
              showExpandableButton={true}
            />
            <Divider/>
            <CardActions expandable={true} style={{textAlign: 'center'}}>
              <FlatButton label='Завантажити резюме'
                          style={{width: '100%', marginBottom: 8}}
                          labelStyle={buttonStyle}
                          labelClassName='action-button-label'
                          onClick={() => getResume(this.props.item)} />
              <Divider/>
              {telephone && [
                <FlatButton label='Зателефонувати'
                            style={{width: '100%', marginTop: 8}}
                            labelStyle={buttonStyle}
                            labelClassName='action-button-label'
                            linkButton={true}
                            href={`tel:${this.props.item.telephone}`} />,
                <div style={{fontStyle: 'italic', marginBottom: 5}}>{this.props.item.telephone}</div>,
                <Divider/>
              ]}
              <FlatButton label='Написати електроного листа'
                          style={{width: '100%', marginTop: 8}}
                          labelStyle={buttonStyle}
                          linkButton={true}
                          href={`mailto::${this.props.item.email}`} />
              <div style={{fontStyle: 'italic'}}>{this.props.item.email}</div>
            </CardActions>
          </Card>
        </div>
      </div>
    )
  }
}
