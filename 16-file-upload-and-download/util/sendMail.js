const nodemailer = require("nodemailer");

module.exports = (isi, tujuan) => {
  nodemailer.createTestAccount().then((testAccount) => {
    const transporter = nodemailer.createTransport({
      ...testAccount.smtp,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    transporter
      .sendMail({
        from: `"Lato Lato" <${testAccount.user}>`,
        to: tujuan,
        subject: "Signup Success",
        html: isi,
      })
      .then((responseTransporter) => {
        console.log(nodemailer.getTestMessageUrl(responseTransporter));
      });
  });
};
