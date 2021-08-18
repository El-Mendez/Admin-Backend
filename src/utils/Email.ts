import Mailgen from "mailgen";
import { createTransport } from "nodemailer";
import { URL } from "url";
import * as constants from "../constants";

const mailGenerator = new Mailgen({
  theme: 'default',
  product: { name: constants.COMPANY, link: constants.COMPANY_LINK, logo: constants.COMPANY_LOGO },
});

const transporter = createTransport({
  service: 'gmail',
  // logger: true,
  auth: {
    type: 'oauth2',
    user: constants.EMAIL_ADDRESS,
    clientId: constants.EMAIL_CLIENT_ID,
    clientSecret: constants.EMAIL_CLIENT_SECRET,
    refreshToken: constants.EMAIL_REFRESH_TOKEN,
  },
});

const recoveryPasswordEmail = (receiverName: string, token: string) => {
  const url = new URL(constants.RECEIVER_PASSWORD_LINK);
  url.searchParams.set('token', token);

  const email = {
    body: {
      greeting: 'Hola',
      signature: 'Sinceramente',
      name: receiverName,
      intro: `Has recibido este correo porque recibimos una petición para resetear tu contraseña de ${constants.COMPANY}.`,
      action: {
        instructions: 'Para resetear tu contraseña dale clic al botón de abajo:',
        button: { color: '#e85b30', text: 'Resetear tu contraseña', link: url.toString() },
      },
      outro: 'Si no has pedido resetear tu contraseña, puedes ignorar este correo.',
    },
  };
  return [mailGenerator.generate(email), mailGenerator.generatePlaintext(email)];
};

const verifyAccountEmail = (receiverName: string, token: string) => {
  const url = new URL(constants.CONFIRM_ACCOUNT_LINK);
  url.searchParams.set('token', token);

  const email = {
    body: {
      greeting: 'Hola',
      signature: 'Sinceramente',
      name: receiverName,
      intro: `¡Bienvenido a ${constants.COMPANY}! Estamos emocionado de conocerte.`,
      action: {
        instructions: `Para empezar a usar ${constants.COMPANY} da click al botón:`,
        button: { color: '#22BC66', text: 'Confirma tu cuenta', link: url.toString() },
      },
      outro: 'Tienes alguna pregunta? Solo responde a este correo, estamos para ayudarte.',
    },
  };
  return [mailGenerator.generate(email), mailGenerator.generatePlaintext(email)];
};

export const sendRecoveryPasswordEmail = async (receiverName: string, receiverEmail: string, token: string): Promise<void> => {
  const [html, text] = recoveryPasswordEmail(receiverName, token);
  await transporter.sendMail({
    from: constants.COMPANY,
    to: receiverEmail,
    subject: 'Cambio de contraseña Meeting',
    html, text,
  });
};

export const sendVerifyAccountEmail = async (receiverName: string, receiverEmail: string, token: string): Promise<void> => {
  const [html, text] = verifyAccountEmail(receiverName, token);
  await transporter.sendMail({
    from: constants.COMPANY,
    to: receiverEmail,
    subject: `Saludos desde ${constants.COMPANY}`,
    html, text,
  });
};
