function createNewIDWithOutPrefix(maxCurrentID, ID_DIGITS = 5) {
    try {
        const idLength = maxCurrentID.length;
        let newMaxID = parseInt(maxCurrentID.substring(idLength - ID_DIGITS, idLength));

        newMaxID += 1; // Tăng 1
        newMaxID = newMaxID.toString().padStart(ID_DIGITS, '0');

        // Trả về tiền tố + ID sau khi tăng 1
        return maxCurrentID.substring(0, idLength - ID_DIGITS) + newMaxID;
    } catch (error) {
        console.log(error.message);
        return 'ERROR';
    }
}

console.log(createNewIDWithOutPrefix('NV00000'));

function createNewIDWithPrefix(maxCurrentID, prefix, ID_DIGITS = 5) {
    try {
        const idLength = maxCurrentID.length;
        let newMaxID = parseInt(maxCurrentID.substring(idLength - ID_DIGITS, idLength));

        newMaxID += 1; // Tăng 1
        newMaxID = newMaxID.toString().padStart(ID_DIGITS, '0');

        return prefix + newMaxID;
    } catch (error) {
        console.log(error.message);
        return prefix;
    }
}
