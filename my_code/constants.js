export const API_URL = process.env.API_URL || `https://api.appcenter.ms/v0.1/apps/`;
export const USER_NAME = process.env.USER_NAME || 'aa-badalov1-mail.ru';
export const PROJECT_NAME = process.env.PROJECT_NAME || 'NewApp';
export const USER_API_TOKEN = process.env.USER_API_TOKEN || '9c7e49ce6af2339ce164798d03f3e8c7e1a8010e';

export const PROJECT_URL = `${API_URL}${USER_NAME}/${PROJECT_NAME}`;
export const BRANCH_URL = `${PROJECT_URL}/branches`;

export const DELAY_TIME = 5000;