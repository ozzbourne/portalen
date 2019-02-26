import Rebase from 're-base'
import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCq4YZgAg2HaFFi5TLIcoG2QuCsSlcP1io",
    authDomain: "portalen-398fe.firebaseapp.com",
    databaseURL: "https://portalen-398fe.firebaseio.com",
    projectId: "portalen-398fe",
    storageBucket: "portalen-398fe.appspot.com",
    messagingSenderId: "278715842495"
  });

  const base = Rebase.createClass(firebaseApp.database());

  export {firebaseApp};

  export default base;