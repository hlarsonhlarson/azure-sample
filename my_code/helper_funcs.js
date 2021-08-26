export const diffTime = (firstTime, secondTime) => {
    return (new Date(secondTime) - new Date(firstTime)) / 1000;
};

export const createResultString = (res, branchName, projectUrl) => {
    return `${branchName} build ${res.result}\
    in ${diffTime(res.finishTime, res.startTime)} seconds.\
    Link to build logs http://${projectUrl}/builds/${res.id}/logs`;
};