import sendEmail from "./sendEmail";

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetPasswordURL = `${origin}/reset-password?token=${token}&email=${email}`;

  const message = `<p><a href="${resetPasswordURL}"> Please reset your password by clicking on this link in no more than 10 minutes!</a></p> <p> Or this link: </p> <a href="${resetPasswordURL}">${resetPasswordURL}</a></p>
  <br/> <p>If you received this email by mistake, please ignore it.</p> <hr/> <h3>Thank you from <a href="${origin}"> ${origin}</a>!</h3>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name}</h4>${message}`,
  });
};

module.exports = sendResetPasswordEmail;
