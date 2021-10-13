// import { recoveryPasswordEmail, verifyAccountEmail } from './templates';

import { reportEmail } from './templates';

export const sendRecoveryPasswordEmail = async (
  receiverName: string,
  receiverEmail: string,
  token: string,
): Promise<void> => {
  // const [, text] = recoveryPasswordEmail(receiverName, token);
  // console.log(text);
};

export const sendVerifyAccountEmail = async (
  receiverName: string,
  receiverEmail: string,
  token: string,
): Promise<void> => {
  // const [, text] = verifyAccountEmail(receiverName, token);
  // console.log(text);
};

export const sendReportUserEmail = async (
  reporter: number,
  reported: number,
  message: string,
): Promise<void> => {
  // const [html, text] = reportEmail(reporter, reported, message);
  // require('fs').writeFileSync('preview.html', html, 'utf-8');
  // console.log(text);
};
