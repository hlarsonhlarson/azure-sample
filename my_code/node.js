import axios from 'axios';
import { PROJECT_URL, BRANCH_URL, USER_API_TOKEN } from './constants';
import { createResultString } from './helper_funcs';


const config = {
    headers: {
        "X-API-Token": USER_API_TOKEN,
        "accept": "application/json"
    },
};


const getBranchesList = async () => {
    try {
        const resp = await axios.get(BRANCH_URL, config);
    } catch (err) {
        console.log(err);
        process.exit(1);
    };

    const branchesInfo = Array.from(resp.data).map((elem) => {
        return {
            name: elem.branch.name,
            reqName: elem.branch.commit.sha,
        };
    });
    return branchesInfo;
};

const sendBuildRequests = async (branchesInfo) => {

    let requestMap = new Map();

    const requests = branchesInfo.map((elem) => {
        try {
            return axios.post(`${PROJECT_URL}/${elem.name}/builds`,
                {
                    "sourceVersion": elem.reqName
                },
                config);
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    });

    const responses = await Promise.all(requests);

    Array.from(responses).forEach(
        (resp) => {
            requestMap.set(resp.data.id, resp.data.sourceBranch);
        }
    );

    return requestMap;
};

const printReadyResult = async (requestMap) => {
    while (requestMap.size > 0) {
        try {
            let results = await Promise.all(ids.map((tmp_id) => {
                return axios.get(`${PROJECT_URL}/builds/${tmp_id}`, config)
            }
            ));
        } catch (error) {
            console.log(error);
            process.env.exit(1);
        }
        results.forEach((res) => {
            if (res.data.status === 'completed') {
                console.log(createResultString(res.data, requestMap.get(res.data.id)));
                requestMap.delete(res.data.id);
            };
        });
    };
};

let branches = await getBranchesList();
let requestMap = await sendBuildRequests(branches);
await printReadyResult(requestMap);