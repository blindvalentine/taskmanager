const sgMail = require('@sendgrid/mail');
const sendgridApiKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridApiKey);


const sendWelcomeEmail = (email, name) => {
    sgMail.send({
      to: email,
      from: 'yongjoong.it@gmail.com',
      subject: 'Thanks for joining!',
      text: `Welcome to the app, ${name}`
    })
}

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'yongjoong.it@gmail.com',
    subject: 'We are sad to see you go :(',
    text: 'Please tell us what we could have done better!'
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}
