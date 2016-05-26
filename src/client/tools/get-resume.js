import createPdf from 'pdfmake-browserified'
import dateFormat from 'dateformat'


export default function getResume(user) {
  let docDefinition = {content: [{text: user.name, fontSize: 22}]}

  if (user.avatar && false) {
    let img = new Image()
    img.setAttribute('crossOrigin', 'use-credentials')
    img.onload = function(){
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      canvas.height = this.height
      canvas.width = this.width
      ctx.drawImage(this, 0, 0)
      let dataURL = canvas.toDataURL('image/png')
      docDefinition.content.push({image: dataURL, width: 150, height: 150})
      completeResume(docDefinition, user)
      createPdf(docDefinition).download(`cv_${user.name.trim().replace(/\s/g, '-')}.pdf`)
    }
    img.src = user.avatar
  } else {
    completeResume(docDefinition, user)
    createPdf(docDefinition).download(`cv_${user.name.trim().replace(/\s/g, '-')}.pdf`)
  }
}

function completeResume(docDefinition, user) {
  if (user.dob) {
    docDefinition.content.push({
      text: '\n\nДата Народження: ' +
      dateFormat(new Date(user.dob), "mmmm dS, yyyy") +
      '\n', fontSize: 10
    })
  }

  if (user.telephone) {
    docDefinition.content.push({text: 'Місто: ' + user.telephone + '\n', fontSize: 10})
  }

  if (user.email) {
    docDefinition.content.push({text: 'Email: ' + user.email + '\n\n', fontSize: 10})
  }

  if (user.about) {
    docDefinition.content.push(
      {text: '\nПро cебе\n\n', fontSize: 16},
      {text: user.about, fontSize: 12}
    )
  }

  if (user.skills.length) {
    docDefinition.content.push(
      {text: '\nНавички\n\n', fontSize: 16},
      {text: user.skills.reduce((str, skill) => str + (str ? ', ' :'') +  skill.name, ''), fontSize: 12}
    )
  }

  if (user.experiences.length) {
    docDefinition.content.push({text: '\nДосвід роботи\n\n', fontSize: 16})
    user.experiences.forEach((item) => {
      docDefinition.content.push({text: item.position.name + '\n', fontSize: 14});
      docDefinition.content.push({
        text: item.companyName.name +
        '\t – \t' + dateFormat(new Date(item.start), "mmmm dS, yyyy") +
        '-' + dateFormat(new Date(item.end), "mmmm dS, yyyy") +
        '\n\n', fontSize: 12
      })
      docDefinition.content.push({text: item.about + '\n\n', fontSize: 12})
    })
  }

  if (user.educations.length) {
    docDefinition.content.push({text: '\nОсвіта\n\n', fontSize: 16})
    user.educations.forEach((item) => {
      docDefinition.content.push({text: item.speciality.name + '\n', fontSize: 14})
      docDefinition.content.push({
        text: dateFormat(new Date(item.start), "mmmm dS, yyyy") +
        '-' + dateFormat(new Date(item.end), "mmmm dS, yyyy") +
        '\n\n', fontSize: 12})
      docDefinition.content.push({text: item.university.name + '\n\n', fontSize: 12})
    })
  }
}