const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const confirmEmailHtml = (email) => `
	<div>
		<h2>Активація користувача</h2>
		<a href="http://localhost:3000/confirm-email?email=${email}">
        Натисніть для активації користувача
    </a>
	</div> 
`;

const forgotPasswordHtml = (resetToken) => `
	<div>
		<h2>Відновлення паролю</h2>
		<a href="http://localhost:3000/reset-password?reset_token=${resetToken}">
        Натисніть для відновлення паролю
    </a>
	</div> 
`;

exports.transport = transport;
exports.confirmEmailHtml = confirmEmailHtml;
exports.forgotPasswordHtml = forgotPasswordHtml;
