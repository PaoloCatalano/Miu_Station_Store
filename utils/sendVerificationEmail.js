import sendEmail from "./sendEmail";

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/verify-email?token=${verificationToken}&email=${email}`;

  const message = `<a href="${verifyEmail}"> Please confirm your email by clicking this link </a> <p> Or this link: </p> <a href="${verifyEmail}">${verifyEmail}</a></p> <hr/> <h2>Thank you from <a href="${origin}"> ${origin}</a>!</h2>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `
        <h1>Hello, ${name}</h1>${message}
        `,
  });
};

module.exports = sendVerificationEmail;
