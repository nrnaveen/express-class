var nodemailer = require('nodemailer'),
    smtp       = require('nodemailer-smtp-transport'),
    hbs        = require('nodemailer-express-handlebars'),
    path       = require('path');

class Mail {

	constructor() {
		if(process.env.MAIL_HOST == 'localhost'){
			this.nodemail = nodemailer.createTransport(smtp({
				host: process.env.MAIL_HOST,
				port: process.env.MAIL_PORT,
				tls:{
					rejectUnauthorized: false
				},
			}));
		}else{
			this.nodemail = nodemailer.createTransport({
				// service: process.env.MAIL_HOST,
				service: process.env.MAIL_SERVICE,
				auth: {
					user: process.env.MAIL_USERNAME,
					pass: process.env.MAIL_PASSWORD,
				}
			});
		}
	}

	getNodeMail(){
		this.nodemail.use('compile', hbs({
			viewEngine: {
				// extname: '.twig',
				layoutsDir: path.join(appRoot, 'views/emails/'),
				// defaultLayout: path.join(appRoot, 'views/emails/'),
				partialsDir: path.join(appRoot, 'views/emails/'),
			},
			viewPath: path.join(appRoot, 'views/emails/'),
			extName: '.twig'
		}));
		return this.nodemail;
	}
};

module.exports = () => {
	var mail = new Mail;
	return {
		Mail: mail,
		Transporter: mail.getNodeMail(),
	};
};