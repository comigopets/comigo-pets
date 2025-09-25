console.log("🔥 Iniciando Firebase...");

const firebaseConfig = {
  apiKey: "AIzaSyApudwYbgzjerguwLWyPw58r4vAK2OT4ME",
  authDomain: "comigo-pets.firebaseapp.com",
  projectId: "comigo-pets",
  storageBucket: "comigo-pets.firebasestorage.app",
  messagingSenderId: "239085731208",
  appId: "1:239085731208:web:78df7588e8c80af8650e3d",
  measurementId: "G-ZYW5RB27S0"
};

firebase.initializeApp(firebaseConfig);
console.log("✅ Firebase inicializado");

// FIRESTORE
const db = firebase.firestore();
console.log("✅ Firestore ok");

const petsContainer = document.getElementById("pets-container");

// RENDERIZA CARDS
function mostrarPets(pets) {
  petsContainer.innerHTML = "";
  pets.forEach(doc => {
    const pet = doc.data();
    const id = doc.id;

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${pet.imagem}" alt="${pet.tipo} chamado ${pet.nome}, raça ${pet.raca}, idade ${pet.idade}" " />
      <h3>${pet.nome}</h3>
      <p><strong>Idade:</strong> ${pet.idade}</p>
      <p><strong>Raça:</strong> ${pet.raca}</p>
      <p><strong>Sexo:</strong> ${pet.sexo}</p>
      <button class="btn-ver-mais" aria-label="Ver mais informações e detalhes para adoção de ${pet.nome}" onclick="abrirModal('${id}')">Ver mais</button>
    `;
    petsContainer.appendChild(card);
  });
}

// FILTRO
function filtrarPets(tipo, botao = null) {
  document.querySelectorAll(".filtro").forEach(btn => btn.classList.remove("ativo"));

  if (botao) {
    botao.classList.add("ativo");
  }

  // Consulta no Firestore
  let query = db.collection("pets").where("status", "==", "disponivel");

  if (tipo !== "todos") {
  query = query.where("tipo", "==", tipo);
  }

  query.get().then(snapshot => {
    mostrarPets(snapshot.docs);
  }).catch(error => {
    console.error("Erro ao buscar pets:", error);
  });
}

// MODAL

let ultimoFoco = null;

window.abrirModal = function (id) {
  ultimoFoco = document.activeElement;

  db.collection("pets").doc(id).get().then(doc => {
    if (doc.exists) {
      const pet = doc.data();
      const modal = document.getElementById("modal");
      modal.style.display = "flex";

      modal.focus();

      // Preenche infos do modal
      document.getElementById("modal-img").src = pet.imagem;
      document.getElementById("modal-nome").innerText = pet.nome;
      document.getElementById("modal-idade").innerText = "Idade: " + pet.idade;
      document.getElementById("modal-sexo").innerText = "Sexo: " + pet.sexo;
      document.getElementById("modal-tipo").innerText = "Tipo: " + pet.tipo;
      document.getElementById("modal-raca").innerText = "Raça: " + pet.raca;
      document.getElementById("modal-vacinado").innerText = "Vacinado: " + (pet.vacinado ? "✅ Sim" : "❌ Não");
      document.getElementById("modal-vermifugado").innerText = "Vermifugado: " + (pet.vermifugado ? "✅ Sim" : "❌ Não");
      document.getElementById("modal-personalidade").innerText = "Personalidade: " + pet.personalidade;

      // Botão de adotar: abre o formulário com query param
      const btnAdotar = document.getElementById("btn-adotar");
      btnAdotar.onclick = function() {
        window.location.href = `formularioadocao.html?animal=${encodeURIComponent(pet.nome)}`;
      };
    }
  }).catch(error => {
    console.error("Erro ao buscar detalhes do pet:", error);
  });
};

window.fecharModal = function () {
  const modal = document.getElementById("modal");
  modal.style.display = "none";

  if (ultimoFoco) {
    ultimoFoco.focus();
  }
};

// Fechar ao clicar fora
window.onclick = function(e) {
  const modal = document.getElementById("modal");
  if (e.target === modal) modal.style.display = "none";
};

window.filtrarPets = filtrarPets;
filtrarPets("todos");

// Função para carregar estatísticas
function carregarEstatisticas() {
  db.collection("estatisticas").doc("geral").get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
        document.getElementById("num-adotados").innerText = data.adotados;
        document.getElementById("num-contribuicoes").innerText = "R$ " + data.contribuicoes;
        document.getElementById("num-resgatados").innerText = data.resgatados;
      } else {
        console.log("Documento de estatísticas não encontrado!");
      }
    })
    .catch(error => {
      console.error("Erro ao carregar estatísticas:", error);
    });
}

// Chamar quando a página carregar
if (window.location.pathname.includes("sobre.html")) {
  carregarEstatisticas();
}