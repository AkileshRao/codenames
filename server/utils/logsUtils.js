
const logs = {};

const addToLogs = (roomId, logMessage) => {
    logs[roomId] = logs[roomId] ? [...logs[roomId], logMessage] : [logMessage];
}

module.exports = { logs, addToLogs }