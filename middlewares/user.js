const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config");


function userMiddleware(req, res, next) {
    const token = req.headers.token;
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded) {
        req.userId = decoded.id;
        next();
    } else {
        res.status(403).json({
            message: "You are not signed in"
        })
    }

}


// IF we want only 1 middlware for both userr and admin we can write the for that like this 
// also there is repetetion in the middlewares of user and admin so we can write like this but sometimes 
// it is better to write like we have written for better understanding



// function middleware(password) {
//     return function(req, res, next) {
//         const token = req.headers.token;
//         const decoded = jwt.verify(token, password);

//         if (decoded) {
//             req.userId = decoded.id;
//             next()
//         } else {
//             res.status(403).json({
//                 message: "You are not signed in"
//             })
//         }    
//     }
// }

module.exports = {
    userMiddleware: userMiddleware
}