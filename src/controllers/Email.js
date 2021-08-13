const Mailgen = require('mailgen');
const nodemailer = require('nodemailer');
const { URL } = require('url');
const CONSTANTS = require('../CONSTANTS');

const mailGenerator = new Mailgen({
  theme: 'default',
  product: { name: CONSTANTS.company, link: CONSTANTS.companyLink, logo: CONSTANTS.companyLogo },
});

const transporter = nodemailer.createTransport({
  service: CONSTANTS.emailService,
  auth: { user: CONSTANTS.email, pass: CONSTANTS.emailPassword },
});

const recoveryPasswordHTML = (receiverName, token) => {
  const url = new URL(CONSTANTS.recoverPasswordLink);
  url.searchParams.set('token', token);

  const email = {
    body: {
      greeting: 'Hola',
      signature: 'Sinceramente',
      name: receiverName,
      intro: `Has recibido este correo porque recibimos una petición para resetear tu contraseña de ${CONSTANTS.company}.`,
      action: {
        instructions: 'Para resetear tu contraseña dale clic al botón de abajo:',
        button: { color: '#e85b30', text: 'Resetear tu contraseña', link: url.toString() },
      },
      outro: 'Si no has pedido resetear tu contraseña, puedes ignorar este correo.',
    },
  };
  return mailGenerator.generate(email);
};

const verifyAccountHTML = (receiverName, token) => {
  const url = new URL(CONSTANTS.confirmAccountLink);
  url.searchParams.set('token', token);

  const email = {
    body: {
      greeting: 'Hola',
      signature: 'Sinceramente',
      name: receiverName,
      intro: `¡Bienvenido a ${CONSTANTS.company}! Estamos emocionado de conocerte.`,
      action: {
        instructions: `Para empezar a usar ${CONSTANTS.company} da click al botón:`,
        button: { color: '#22BC66', text: 'Confirma tu cuenta', link: url.toString() },
      },
      outro: 'Tienes alguna pregunta? Solo responde a este correo, estamos para ayudarte.',
    },
  };
  return mailGenerator.generate(email);
};

exports.sendRecoveryPasswordEmail = async (receiverName, receiverEmail, token) => {
  await transporter.sendMail({
    from: CONSTANTS.company,
    to: receiverEmail,
    subject: 'Cambio de contraseña Meeting',
    html: recoveryPasswordHTML(receiverName, token),
  });
};

exports.sendVerifyAccountEmail = async (receiverName, receiverEmail, token) => {
  await transporter.sendMail({
    from: CONSTANTS.company,
    to: receiverEmail,
    subject: `Saludos desde ${CONSTANTS.company}`,
    html: verifyAccountHTML(receiverName, token),
  });
};
