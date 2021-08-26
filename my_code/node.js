import axios from 'axios';
// curl -X GET "https://api.appcenter.ms/v0.1/apps/aa-badalov1-mail.ru/AAAAAAA/branches" 
// -H  "accept: application/json" -H  "X-API-Token: 9c7e49ce6af2339ce164798d03f3e8c7e1a8010e"

const USER_NAME = 'aa-badalov1-mail.ru';
const PROJECT_NAME = 'AAAAAAA';
const API_TOKEN = '33cdd101bd4d9e4c734144bd28746724d0e0ce78';
const USER_API_TOKEN = '9c7e49ce6af2339ce164798d03f3e8c7e1a8010e';

const GET_BRANCH_URL = `https://api.appcenter.ms/v0.1/apps/`;
const getConfig = {
    headers: {
        "X-API-Token": USER_API_TOKEN,
        "accept": "application/json"
    },
};
const FINAL_GET_URL = `${GET_BRANCH_URL}${USER_NAME}/${PROJECT_NAME}/branches`;
const resp = await axios.get(FINAL_GET_URL, getConfig);
console.log(resp.data.map((elem) => {
    elem.branch.name;
}));
const branchesList = () => {
    JSON.parse(resp.data);
};
console.log(branchesList());