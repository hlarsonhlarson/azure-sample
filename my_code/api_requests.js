import axios from 'axios';

import { PROJECT_URL, BRANCH_URL, USER_API_TOKEN } from './constants.js';
import { errorHandlerAPI } from './helper_funcs.js';

const config = {
    headers: {
        "X-API-Token": USER_API_TOKEN,
        "accept": "application/json"
    },
};

export const branchesGetRequest = async () => {
    try {
        return await axios.get(BRANCH_URL, config);
    } catch (err) {
        errorHandlerAPI(err);
    };
};

export const buildPostRequest = async (branchesInfo) => {
    try {
        const requests = branchesInfo.map((elem) => {
            return axios.post(`${BRANCH_URL}/${elem.name}/builds`,
                {
                    "sourceVersion": elem.reqName
                },
                config);
        });
        return await Promise.all(requests);
    } catch (err) {
        errorHandlerAPI(err);
    }
}

export const buildGetRequest = async (requestMap) => {
    try {
        let results = await Promise.all(Array.from(requestMap.keys()).map((tmp_id) => {
            return axios.get(`${PROJECT_URL}/builds/${tmp_id}`, config)
        }
        ));
        return results;
    } catch (err) {
        errorHandlerAPI(err);
    }
}