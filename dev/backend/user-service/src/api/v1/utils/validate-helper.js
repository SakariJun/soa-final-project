function validatePhoneNumber(input_str) {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;

    return re.test(input_str);
}

function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

// Past a Date into this function to format Date into DD/MM/YYYY format
function formatDate(date) {
    return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join('/');
}

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, function (m) {
        return map[m];
    });
}

function stripSlashes(text) {
    return text.replace(/\\(.)/gm, '$1');
}

function validateInput(input) {
    if (typeof input === 'string') {
        input = input.trim();
        input = stripSlashes(input);
        input = escapeHtml(input);
    }

    return input;
}

module.exports = {
    validatePhoneNumber,
    validateEmail,
    formatDate,
    validateInput,
};
