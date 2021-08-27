import { branchesGetRequest, buildGetRequest, buildPostRequest } from './api_requests';
import { createResultString, sleep } from './helper_funcs.js';
import { PROJECT_URL, DELAY_TIME } from './constants';

const getBranchesList = async () => {
    let resp = await branchesGetRequest();
    if (!resp || !resp.data){
        console.log('There are no branches to build');
        process.exit(1);
    }
    const branchesInfo = Array.from(resp.data).map((elem) => {
        return {
            name: elem.branch.name,
            reqName: elem.branch.commit.sha,
        };
    });
    return branchesInfo;
};

const sendBuildRequests = async (branchesInfo) => {
    const responses = await buildPostRequest(branchesInfo);
    let requestMap = new Map();
    Array.from(responses).forEach(
        (resp) => {
            requestMap.set(resp.data.id, resp.data.sourceBranch);
        }
    );
    return requestMap;
};

const printReadyResult = async (requestMap) => {
    while (requestMap.size > 0) {
        let results = await buildGetRequest(requestMap);
        results.forEach((res) => {
            if (res.data.status === 'completed') {
                console.log(createResultString(res.data, requestMap.get(res.data.id), PROJECT_URL));
                requestMap.delete(res.data.id);
            };
        });
        if (requestMap.size > 0) {
            await sleep(DELAY_TIME);
        }
    };
};

let branches = await getBranchesList();
let requestMap = await sendBuildRequests(branches);
await printReadyResult(requestMap);