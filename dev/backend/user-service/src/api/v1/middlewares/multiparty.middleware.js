// const multiparty = require("multiparty");

// const getFormDataToRequestMiddleware = (req, res, next) => {
//     const form = new multiparty.Form();

//     form.parse(req, async (err, fields, files) => {
//         if (err) {
//             return res.status(500).json({
//                 status: false,
//                 message: err.message,
//             });
//         }

//         req.body = fields;
//         req.files = files;
//         next();
//     });
// }

// module.exports = {getFormDataToRequestMiddleware}
