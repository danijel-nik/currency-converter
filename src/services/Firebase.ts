import firebase from 'firebase';
import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';

const {
    REACT_APP_FIREBASE_API_KEY,
    REACT_APP_FIREBASE_AUTH_DOMAIN,
    REACT_APP_FIREBASE_DATABASE_URL,
    REACT_APP_FIREBASE_PROJECT_ID,
    REACT_APP_FIREBASE_STORAGE_BUCKET,
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID
} = process.env;

const config = {
    apiKey: REACT_APP_FIREBASE_API_KEY,
    authDomain: REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: REACT_APP_FIREBASE_DATABASE_URL,
    projectId: REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

// const settings = {timestampsInSnapshots: true};

class Firebase {

    auth: any;
    db: any;

    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.firestore(); // .settings(settings);
    }

    login(email: string, password: string) {
        return this.auth.signInWithEmailAndPassword(email.trim(), password);
    }

    loginGoogle() {
        let provider = new firebase.auth.GoogleAuthProvider();
        return this.auth.signInWithPopup(provider);
    }

    logout() {
        return this.auth.signOut();
    }

    register(email: string, password: string) {
        return this.auth.createUserWithEmailAndPassword(email, password);
    }

    async saveResult(userId: string, saveAs: string, date: string, amount: string, from: string, converted: string, to: string) {
        await this.db.collection("currencies").doc().set({
            name: saveAs,
            date,
            amount,
            from,
            converted,
            to,
            userId
        })
    }

    getResults(userId: string) {
        // this.db.collection("currencies").where("amount", "==", "1078"); //.doc(id); // for specific doc
        return this.db.collection("currencies").where("userId", "==", userId).get();
    }

    async deleteResult(id: string) {
        await this.db.collection("currencies").doc(id).delete();
    }
}

export default new Firebase();