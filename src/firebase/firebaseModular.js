import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import firebase from "./firebase"; // apunta a tu firebase.initializeApp

const db = getFirestore(firebase);
export { db, collection, addDoc, serverTimestamp };
