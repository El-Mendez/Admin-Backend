import { ENVIRONMENT } from '../../constants';

const Email = ENVIRONMENT === 'production' ? import('./Email') : import('./Email.fake');

export const sendRecoveryPasswordEmail = async (
  receiverName: string,
  receiverEmail: string,
  token: string,
): Promise<void> => {
  const service = await Email;
  return service.sendRecoveryPasswordEmail(receiverName, receiverEmail, token);
};

export const sendVerifyAccountEmail = async (
  receiverName: string,
  receiverEmail: string,
  token: string,
): Promise<void> => {
  const service = await Email;
  return service.sendVerifyAccountEmail(receiverName, receiverEmail, token);
};

export const sendReportEmail = async (
  reporter: number,
  reported: number,
  message: string,
): Promise<void> => {
  const service = await Email;
  return service.sendReportUserEmail(reporter, reported, message);
};
