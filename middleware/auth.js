const jwt = require('jsonwebtoken');
const config = require('config');

//next is the callback function which ensures that next middleware is called
module.exports = (req, res, next) => {

    const token = req.header('x-auth-token');

    //check if token is present or not
    if (!token) {
        return res.status(401).json({
            msg: "Authorization token not provided, Access Denied"
        });
    }

    //Verify token
    //decrypt token
    try {
        const decrypted = jwt.verify(token, config.get('secretKey'));
        req.user = decrypted.user;
        next()
    } catch (err) {
        console.error(err.message);
        res.status(401).json({
            msg: "Authorization token is invalid, Access Denied"
        });
    }
}