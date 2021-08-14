module.exports = {
  // Para la base de datos
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  // Para los correos
  email: process.env.EMAIL,
  emailClientId: process.env.EMAIL_CLIENT_ID,
  emailClientSecret: process.env.EMAIL_CLIENT_SECRET,
  emailRefreshToken: process.env.EMAIL_REFRESH_TOKEN,
  receiverDomain: process.env.RECEIVER_EMAIL_DOMAIN,

  // Links y otros
  company: process.env.COMPANY_NAME,
  companyLogo: process.env.COMPANY_LOGO,
  companyLink: process.env.COMPANY_LINK,
  recoverPasswordLink: process.env.RECOVER_PASSWORD_LINK,
  confirmAccountLink: process.env.CONFIRM_ACCOUNT_LINK,

  // tokens para los jwt
  authTokenKey: process.env.AUTH_TOKEN_KEY,
  resetPasswordTokenKey: process.env.RESET_PASSWORD_TOKEN_KEY,
  verifyAccountTokenKey: process.env.VERIFY_ACCOUNT_TOKEN_KEY,
};
