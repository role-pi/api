import nodemailer from 'nodemailer';

let source = 'role.pi.app@gmail.com';

let transporter = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
       user: source, 
       pass: 'zpolsxlxqnvxfjdw' 
     } 
});

export function sendMail(email, subject, text) {
    const mailOptions = {
        from: source,
        to: email,
        subject: subject,
        html: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error)
            console.log(error)
        else
            console.log("Sent email to " + email);
    });
}