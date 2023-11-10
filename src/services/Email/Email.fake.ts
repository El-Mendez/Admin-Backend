// import { recoveryPasswordEmail, verifyAccountEmail } from './templates';

import { helpEmail, reportEmail } from './templates';

export const sendRecoveryPasswordEmail = async (
  receiverName: string,
  receiverEmail: string,
  token: string,
): Promise<void> => {
  const [html, text] = recoveryPasswordEmail(receiverName, token);
  console.log(text);
};

export const sendVerifyAccountEmail = async (
  receiverName: string,
  receiverEmail: string,
  token: string,
): Promise<void> => {
  const [html, text] = verifyAccountEmail(receiverName, token);
  console.log(text);
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

export const sendHelpEmail = async (
  carne: number,
  userName: string,
  message: string,
  userEmail: string,
): Promise<void> => {
  const [html, text] = helpEmail(userName, carne, message, userEmail);
  console.log(text);
};
