import firebase from 'firebase'
import 'firebase/firebase-database'


  var firebaseConfig = {
    apiKey: "AIzaSyCtp65wvil_dKH5ldqNii6f3lw7aZrqxlI",
    authDomain: "kacepay-mobile.firebaseapp.com",
    databaseURL: "https://kacepay-mobile-default-rtdb.firebaseio.com",
    projectId: "kacepay-mobile",
    storageBucket: "kacepay-mobile.appspot.com",
    messagingSenderId: "1080386551375",
    appId: "1:1080386551375:web:7153ea818fb943b5f4343a",
    measurementId: "G-Q9GM6GCT7D"
  };
  firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    db.settings({ timestampsInSnapshots: true });

    export default db;

