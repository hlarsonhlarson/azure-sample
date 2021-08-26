import axios from 'axios';

import { createResultString } from './helper_funcs.js';
import { PROJECT_URL, BRANCH_URL, USER_API_TOKEN } from './constants.js';


const config = {
    headers: {
        "X-API-Token": USER_API_TOKEN,
        "accept": "application/json"
    },
};


const getBranchesList = async () => {
    try {
        const resp = await axios.get(BRANCH_URL, config);
        const branchesInfo = Array.from(resp.data).map((elem) => {
            return {
                name: elem.branch.name,
                reqName: elem.branch.commit.sha,
            };
        });
        return branchesInfo;
    } catch (err) {
        console.log(err);
        process.exit(1);
    };

};

const sendBuildRequests = async (branchesInfo) => {


    const requests = branchesInfo.map((elem) => {
        return axios.post(`${BRANCH_URL}/${elem.name}/builds`,
            {
                "sourceVersion": elem.reqName
            },
            config);
    });

    try {
        let requestMap = new Map();
        const responses = await Promise.all(requests);
        Array.from(responses).forEach(
            (resp) => {
                requestMap.set(resp.data.id, resp.data.sourceBranch);
            }
        );

        return requestMap;
    } catch (err) {
        console.log(err);
        process.exit(1);
    }

};

const printReadyResult = async (requestMap) => {
    while (requestMap.size > 0) {
        try {
            let results = await Promise.all(Array.from(requestMap.keys()).map((tmp_id) => {
                return axios.get(`${PROJECT_URL}/builds/${tmp_id}`, config)
            }
            ));
            results.forEach((res) => {
                if (res.data.status === 'completed') {
                    console.log(createResultString(res.data, requestMap.get(res.data.id), PROJECT_URL));
                    requestMap.delete(res.data.id);
                };
            });
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    };
};

let branches = await getBranchesList();
let requestMap = await sendBuildRequests(branches);
await printReadyResult(requestMap);