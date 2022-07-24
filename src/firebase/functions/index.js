const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.database();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.createUser = functions.auth.user().onCreate((user) => {
    user.displayName = user.displayName || user.email.split("@")[0];

    db.ref(`usernames/${user.displayName}`).set(user.uid);
    db.ref(`users/${user.uid}`).set({
        username: user.displayName,
        email: user.email
    });

    return Promise.resolve();
});

exports.deleteUser = functions.auth.user().onDelete((user) => {
    const username = user.displayName || user.email.split("@")[0];
    db.ref(`usernames/${username}`).remove();
    db.ref(`users/${user.uid}`).remove();
});
