let nodemailer = require('nodemailer');

let source = 'role.pi.app@gmail.com';

let transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
       user: source, 
       pass: 'zpolsxlxqnvxfjdw' 
     } 
});

function sendMail(email, subject, text) {
    const mailOptions = {
        from: source,
        to: email,
        subject: subject,
        html: text
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if(err)
            console.log(err)
        else
            console.log(info);
    });
}