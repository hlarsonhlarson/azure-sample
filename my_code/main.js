import { branchesGetRequest, buildGetRequest, buildPostRequest } from './api_requests';
import { createResultString, sleep } from './helper_funcs.js';
import { PROJECT_URL } from './constants';

const getBranchesList = async () => {
    const resp = await branchesGetRequest();
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
        let results = buildGetRequest(requestMap);
        results.forEach((res) => {
            if (res.data.status === 'completed') {
                console.log(createResultString(res.data, requestMap.get(res.data.id), PROJECT_URL));
                requestMap.delete(res.data.id);
            };
        });
        if (requestMap.size > 0) {
            await sleep(5000);
        }
    };
};

let branches = await getBranchesList();
let requestMap = await sendBuildRequests(branches);
await printReadyResult(requestMap);