function convertJSDateToVNDateTime(jsDate) {
    let date = jsDate.getDate();
    let month = jsDate.getMonth() + 1;
    let year = jsDate.getFullYear();

    let hour = jsDate.getHours().toString().length == 1 ? "0" + jsDate.getHours().toString() : jsDate.getHours();
    let minute = jsDate.getMinutes().toString().length == 1 ? "0" + jsDate.getMinutes().toString() : jsDate.getMinutes();
    let second = jsDate.getSeconds().toString().length == 1 ? "0" + jsDate.getSeconds().toString() : jsDate.getSeconds();

    return `${date}/${month}/${year} ${hour}:${minute}:${second}`;
}

module.exports = {
    convertJSDateToVNDateTime,
};