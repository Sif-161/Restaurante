import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDUxmPvZ6BHG98me9DUIv5YlMPzx4HmWl8",
  authDomain: "struct-restaurante.firebaseapp.com",
  projectId: "struct-restaurante",
  storageBucket: "struct-restaurante.firebasestorage.app",
  messagingSenderId: "49001002546",
  appId: "1:49001002546:web:cd232716bb197a0044ee2b",
  measurementId: "G-5M2E12E5V6",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para listar subcoleções e documentos
async function listarSubcolecoes(documentPath) {
  try {
    // Obter referência ao documento principal
    const documentRef = doc(db, documentPath);
    const documentSnapshot = await getDoc(documentRef);

    if (!documentSnapshot.exists()) {
      console.log("Documento não encontrado:", documentPath);
      return;
    }

    console.log(`Documento encontrado: ${documentPath}`);
    console.log("Dados:", documentSnapshot.data());

    // Subcoleções conhecidas
    const subcolecoes = ["aperitivos", "steaks", "massas", "frangos_e_peixes"];

    for (const subcolecao of subcolecoes) {
      console.log(`Subcoleção: ${subcolecao}`);
      const subcollectionRef = collection(db, `${documentPath}/${subcolecao}`);
      const subcollectionSnapshot = await getDocs(subcollectionRef);

      subcollectionSnapshot.forEach((doc) => {
        console.log(`  Documento ID: ${doc.id}`);
        console.log("  Dados:", doc.data());
      });
    }
  } catch (error) {
    console.error("Erro ao listar subcoleções e documentos:", error);
  }
}

// Exemplo de uso
listarSubcolecoes("menus/menu_principal");
