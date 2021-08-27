import { PROJECT_URL } from './constants';

export const diffTime = (firstTime, secondTime) => {
    return (new Date(secondTime) - new Date(firstTime)) / 1000;
};

export const createResultString = (res, branchName) => {

    return `${branchName} build ${res.result}\
 in ${diffTime(res.finishTime, res.startTime)} seconds.\
 Link to build logs ${PROJECT_URL}/builds/${res.id}/logs`;

};

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const errorHandlerAPI = (error) => {
    if ((error.response)) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        console.log(error.request);
        console.log('Try to change reqyest url');
    } else {
        console.log('Error', error.message);
    }
    process.exit(1);
};