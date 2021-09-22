import { recoveryPasswordEmail, verifyAccountEmail } from './templates';

export const sendRecoveryPasswordEmail = async (
  receiverName: string,
  receiverEmail: string,
  token: string,
): Promise<void> => {
  const [, text] = recoveryPasswordEmail(receiverName, token);
  console.log(text);
};

export const sendVerifyAccountEmail = async (
  receiverName: string,
  receiverEmail: string,
  token: string,
): Promise<void> => {
  const [, text] = verifyAccountEmail(receiverName, token);
  console.log(text);
};
