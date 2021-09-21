import { createTransport } from 'nodemailer';
import * as constants from '../../constants';
import { recoveryPasswordEmail, verifyAccountEmail } from './templates';

const transporter = createTransport({
  service: 'gmail',
  logger: true,
  auth: {
    type: 'oauth2',
    user: constants.EMAIL_ADDRESS,
    clientId: constants.EMAIL_CLIENT_ID,
    clientSecret: constants.EMAIL_CLIENT_SECRET,
    refreshToken: constants.EMAIL_REFRESH_TOKEN,
  },
});

export const sendRecoveryPasswordEmail = async (
  receiverName: string,
  receiverEmail: string,
  token: string,
): Promise<void> => {
  const [html, text] = recoveryPasswordEmail(receiverName, token);
  await transporter.sendMail({
    from: constants.COMPANY,
    to: receiverEmail,
    subject: 'Cambio de contraseña Meeting',
    html,
    text,
  });
};

export const sendVerifyAccountEmail = async (
  receiverName: string,
  receiverEmail: string,
  token: string,
): Promise<void> => {
  const [html, text] = verifyAccountEmail(receiverName, token);
  await transporter.sendMail({
    from: constants.COMPANY,
    to: receiverEmail,
    subject: `Saludos desde ${constants.COMPANY}`,
    html,
    text,
  });
};
