const sgMail = require("@sendgrid/mail");
const { config } = require('dotenv');
config()
console.log(process.env.SendGrid);
sgMail.setApiKey(process.env.SendGrid);

const sendWelcomeEmail = (email, name, matter) => {
    console.log(email, name);
    sgMail.send({
        from: "chandrakanth.chinthakuntla@gmail.com",
        to: email,
        subject: "submission received",
        text: matter
    });
};
module.exports = {
    sendWelcomeEmail,
};