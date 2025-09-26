// Usa a mesma configuração do firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyApudwYbgzjerguwLWyPw58r4vAK2OT4ME",
  authDomain: "comigo-pets.firebaseapp.com",
  projectId: "comigo-pets",
  storageBucket: "comigo-pets.firebasestorage.app",
  messagingSenderId: "239085731208",
  appId: "1:239085731208:web:78df7588e8c80af8650e3d",
  measurementId: "G-ZYW5RB27S0"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Conecta ao Firestore
const db = firebase.firestore();

// Pega container dos pets
const adotadosContainer = document.getElementById("adotados-container");

// Função para exibir os pets adotados
function mostrarAdotados(pets) {
  adotadosContainer.innerHTML = "";

  pets.forEach(doc => {
    const pet = doc.data();

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${pet.imagem}" alt="${pet.nome}" />
      <h3>${pet.nome}</h3>
      <p><strong>Idade:</strong> ${pet.idade}</p>
      <p><strong>Sexo:</strong> ${pet.sexo}</p>
      <p style="color: green; font-weight: bold;">Adotado ✅</p>
    `;

    adotadosContainer.appendChild(card);
  });
}

// Buscar somente pets com status = "adotado"
db.collection("pets").where("status", "==", "adotado").get()
  .then(snapshot => {
    mostrarAdotados(snapshot.docs);
  })
  .catch(error => {
    console.error("Erro ao buscar pets adotados:", error);
  });
