import axios from 'axios';

const USER_NAME = 'aa-badalov1-mail.ru';
const PROJECT_NAME = 'AAAAAAA';
const USER_API_TOKEN = '9c7e49ce6af2339ce164798d03f3e8c7e1a8010e';

const API_URL = `https://api.appcenter.ms/v0.1/apps/`;
const config = {
    headers: {
        "X-API-Token": USER_API_TOKEN,
        "accept": "application/json"
    },
};

const BRANCH_URL = `${API_URL}${USER_NAME}/${PROJECT_NAME}/branches`;
const resp = await axios.get(BRANCH_URL, config);
const branchesInfo = Array.from(resp.data).map((elem) => {
    return {
        name: elem.branch.name,
        reqName: elem.branch.commit.sha,
    };
});

let requestMap = new Map();

const requests = branchesInfo.map((elem) => {
    return axios.post(`${BRANCH_URL}/${elem.name}/builds`, config);
});

const responses = await Promise.all(requests);

Array.from(responses).forEach(
 (resp) =>{
    requestMap.set(resp.data.id, elem.name);
}
);

while (requestMap.size > 0){
    let results = await Promise.all(ids.map((tmp_id) => {
        return axios.get(`${API_URL}${USER_NAME}/${PROJECT_NAME}/builds/${tmp_id}`
    )}
    ));
    results.data.forEach((res) => {
        if (res.status === 'completed'){
            console.log(`${requestMap[res.id]} build ${res.result} in ${(Date(res.finishTime) - Date(res.startTime)) / 1000} seconds. Link to build logs ${API_URL}${USER_NAME}/${PROJECT_NAME}/builds/${tmp_id}/logs`);
        };
    });
    console.log('Something happened');
}

