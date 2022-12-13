const { ID_DIGITS } = require('../constants/global.constant');

function createNewIDWithOutPrefix(maxCurrentID) {
    try {
        const idLength = maxCurrentID.length;
        let newMaxID = parseInt(maxCurrentID.substring(idLength - ID_DIGITS, idLength));

        newMaxID += 1; // Tăng 1
        newMaxID = newMaxID.toString().padStart(ID_DIGITS, '0');

        // Trả về tiền tố + ID sau khi tăng 1
        return maxCurrentID.substring(0, idLength - ID_DIGITS) + newMaxID;
    } catch (error) {
        console.error(error.message);
        return 'ERROR';
    }
}

function createNewIDWithPrefix(maxCurrentID, prefix) {
    try {
        const idLength = maxCurrentID.length;
        let newMaxID = parseInt(maxCurrentID.substring(idLength - ID_DIGITS, idLength));

        newMaxID += 1; // Tăng 1
        newMaxID = newMaxID.toString().padStart(ID_DIGITS, '0');

        return prefix + newMaxID;
    } catch (error) {
        console.error(error.message);
        return prefix;
    }
}

module.exports = {
    createNewIDWithOutPrefix,
    createNewIDWithPrefix,
};
