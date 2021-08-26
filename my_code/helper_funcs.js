import { PROJECT_URL } from "./constants";

export const diffTime = (firstTime, secondTime) => {
    return (new Date(secondTime) - new Date(firstTime)) / 1000;
};

export const createResultString = (res, branchName) => {
    return `${branchName} build ${res.result}\
     in ${diffTime(res.finishTime, res.startTime)} seconds.\
      Link to build logs ${PROJECT_URL}/builds/${res.id}/logs`;
};