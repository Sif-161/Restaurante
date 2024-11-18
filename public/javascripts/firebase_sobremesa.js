// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUxmPvZ6BHG98me9DUIv5YlMPzx4HmWl8",
  authDomain: "struct-restaurante.firebaseapp.com",
  projectId: "struct-restaurante",
  storageBucket: "struct-restaurante.firebasestorage.app",
  messagingSenderId: "49001002546",
  appId: "1:49001002546:web:cd232716bb197a0044ee2b",
  measurementId: "G-5M2E12E5V6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app); 


async function itensMenuPrincipal() {
  const menuId = "sobremesa";
  const aperitivosCollectionRef = collection(db, "menus", menuId, "aperitivos");

  try {
    const snapshot = await getDocs(aperitivosCollectionRef);
    snapshot.forEach((doc) => {
      console.log(`ID: ${doc.id}, Data:`, doc.data());
    });
  } catch (error) {
    console.error("Erro ao acessar a subcoleção:", error);
  }
}

itensMenuPrincipal();
