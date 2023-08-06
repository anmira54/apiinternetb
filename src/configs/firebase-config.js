const admin = require('firebase-admin');

const serviceAccount = require('../middleware/ServiceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

module.exports = admin;