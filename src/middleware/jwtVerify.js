const admin = require("../configs/firebase-config");

class jwtVerify {
    async decodeToken(req, res, next) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decodeValue = await admin.auth().verifyIdToken(token);
            if (decodeValue) {
                req.user = decodeValue;
                return next();
            }
            return res.json({ message: "Unauthorize" });
        } catch (e) {
            console.log(e)
            return res.json({ message: "Internal Error" });
        }
    }
}

module.exports = new jwtVerify();