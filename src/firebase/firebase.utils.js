import firebase from 'firebase/app';
import config  from './_config'
import 'firebase/firestore';
import 'firebase/auth';
const firebaseConfig = config;


export const getUserProfileDocument = async (userAuth) => {
    return firestore.doc(`users/${userAuth.uid}`);
}

export const createUserProfileDocument = async (userAuth, additionalData) => {
    const userRef = await getUserProfileDocument(userAuth);
    const snapShot = await userRef.get();
    const {exists} = snapShot;
    if (exists) {
        // Update tokens if they've changed
        const {twitterToken, twitterSecret} = snapShot.data()
        if (twitterSecret !== additionalData.twitterSecret || twitterToken !== additionalData.twitterToken) {
            try {
                await userRef.update({twitterToken, twitterSecret})
            } catch (error) {
                console.error('error updating user', error.message)
            }
        }
        return;
    }

    const {displayName} = userAuth;
    const createdAt = new Date();
    try {
        await userRef.set({
            displayName,
            createdAt,
            ...additionalData
        })
    } catch (error) {
        console.error('error creating user', error.message)
    }
    return userRef;
}

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const provider = new firebase.auth.TwitterAuthProvider();
provider.setCustomParameters({prompt: 'select_account'});
export default firebase;
