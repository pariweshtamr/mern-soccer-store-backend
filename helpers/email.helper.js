import nodemailer from 'nodemailer'

//create reusable transporter object using the default SMTP transport
const send = async (infoObj) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   host: process.env.EMAIL_SMTP,
    //   port: 587,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // })
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MYEMAIL_USER,
        pass: process.env.MYEMAIL_PASSWORD,
      },
    })

    // send mail with defined transport object
    let info = await transporter.sendMail(infoObj)

    console.log('Message sent: %s', info.messageId)
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {
    console.log(error)
  }
}

const emailProcessor = ({ email, subject, text, html }) => {
  let info = {
    from: `"Soccer-Store 👻" <${process.env.EMAIL_USER}>`, // sender address
    to: email, // list of receivers
    subject, // Subject line
    text,
    html,
  }
  send(info)
}

export const sendEmailVerificationLink = (emailObj) => {
  const { firstName, pin, email } = emailObj

  const link = `https://mern-soccer-store.herokuapp.com/email-verification?pin=${pin}&email=${email}`
  const obj = {
    ...emailObj,
    subject: 'Email confirmation required',
    text: `Hi ${firstName}, please follow the link below to confirm your email. ${link}`, // plain text body
    html: `
  Hello ${firstName},
  <br/>
  
  Please follow the link below to confirm your email. <br/>
  <a href="${link}" target="_blank"> ${link} </a>
  
  <br/><br/>   
  Thank you<br/><br/>
  
  Kind Regards, <br/><br/>
  --Soccer Store.--
  `, // html body
  }
  emailProcessor(obj)
}

//send the email confirm welcome message

export const sendEmailVerificationConfirmation = (emailObj) => {
  const { firstName } = emailObj

  const obj = {
    ...emailObj,
    subject: 'Email verification successful',
    text: `Hi ${firstName}, Your email has been verified. You can now log in!`, // plain text body
    html: `
  Hello ${firstName},
  <br/>
  Your email has been verified. You can now log in!
  <br/><br/>
  Thank you<br/><br/>
  Kind Regards, <br/><br/>
  --Soccer Store.--
  `, // html body
  }
  emailProcessor(obj)
}

//send the email confirming password update

export const sendPasswordUpdateNotification = (emailObj) => {
  const { firstName = '' } = emailObj

  const obj = {
    ...emailObj,
    subject: 'Password update successful',
    text: `Hi ${firstName}, Your password has been successfully updated. You can now use your new password to log in! If you did not make this change, please contact us immediately!`, // plain text body
    html: `
Hello ${firstName},
<br/>
Your password has been successfully updated. You can now use your new password to log in! If you did not make this change, please contact us immediately!
<br/><br/>
Thank you<br/><br/>
Kind Regards, <br/><br/>
Soccer Boot Store.
`, // html body
  }
  emailProcessor(obj)
}

//send email with otp to client

export const sendPasswordResetOtp = (emailObj) => {
  const { firstName, otp } = emailObj

  const obj = {
    ...emailObj,
    subject: 'Password reset request',
    text: `Hi ${firstName}, please use the following OTP to reset your password. ${otp}. The OTP will expire in 10 minutes. `, // plain text body
    html: `
Hello ${firstName},
<br/><br/>
please use the following OTP to reset your password.
<br/><br/>${otp} 
<br/><br/>The OTP will expire in 10 minutes.<br/><br/>
Thank you<br/><br/>
Kind Regards, <br/><br/>
Soccer Boot Store.
`, // html body
  }
  emailProcessor(obj)
}
