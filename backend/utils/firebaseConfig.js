const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    //storageBucket: "intern-ca93c.appspot.com",
  });
}

module.exports = admin;
