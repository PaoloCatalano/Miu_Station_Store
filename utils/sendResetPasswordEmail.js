import sendEmail from "./sendEmail";

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  const resetPasswordURL = `${origin}/reset-password?token=${token}&email=${email}`;

  const message = `<p><a href="${resetPasswordURL}"> Please reset your password by clicking on this link in no more than 10 minutes!</a></p> <p> Or click this link: </p> <a href="${resetPasswordURL}">${resetPasswordURL}</a></p>
  <br/> <p>If you received this email by mistake, please ignore it.</p> <hr/> <h2>Thank you from <a href="${origin}"> ${origin}</a>!</h2>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h1>Hello, ${name}</h1>${message}`,
  });
};

module.exports = sendResetPasswordEmail;
