var exports = module.exports = {};

const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'imsn.plantech@gmail.com',
		pass: 'iMSNMSNi'
	}
});

exports.sendMail = function(email,sub,message)
{
		
	let mailOptions = {
		from: 'imsn.plantech@gmail.com', // sender address
		to: email, // list of receivers
		subject: sub, // Subject line
		text: message, // plain text body
		//html: '<b>Hello world ?</b>', // html body
	};

	transporter.sendMail(mailOptions);
}


exports.sendMailToUs = function(email,sub,message)
{
	message+=email+"\n"+message;

	let mailOptions = {
		to: 'imsn.plantech@gmail.com', // sender address
		from: 'imsn.plantech@gmail.com', // list of receivers
		subject: sub, // Subject line
		text: message, // plain text body
		//html: '<b>Hello world ?</b>', // html body
	};

	transporter.sendMail(mailOptions);
}