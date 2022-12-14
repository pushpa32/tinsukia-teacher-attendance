import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9IBW5lt2MDgKud2mZlIKpLaXsj--XDHA",
    authDomain: "tinsukia-57e5a.firebaseapp.com",
    projectId: "tinsukia-57e5a",
    storageBucket: "tinsukia-57e5a.appspot.com",
    messagingSenderId: "71479257679",
    appId: "1:71479257679:web:6740c5ecc188782743983a",
    measurementId: "G-1BCJTTEYJL"
};

// const firebaseConfig = {
//     apiKey: "AIzaSyBensvQwQIcs8lorHxEc_0PEhFrFeTndi4",
//     authDomain: "react-message-ed347.firebaseapp.com",
//     projectId: "react-message-ed347",
//     storageBucket: "react-message-ed347.appspot.com",
//     messagingSenderId: "177924999736",
//     appId: "1:177924999736:web:05b30603e2f0a7daa6f4cd",
//     measurementId: "G-W677XZK5PH"
// };

const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app)