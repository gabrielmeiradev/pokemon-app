let db;

let request = window.indexedDB.open("pokemap", 1);

request.onerror = function(event) {
  console.error("Erro ao abrir o banco de dados:", event.target.errorCode);
};

request.onupgradeneeded = function(event) {
  db = event.target.result;

  db.createObjectStore("tokens", { keyPath: "id" });

  console.log("Banco de dados atualizado com sucesso!");
};

request.onsuccess = function(event) {
  db = event.target.result;
};

export function addOrGetToken(token) {
  let transaction = db.transaction(["tokens"], "readwrite");
  let objectStore = transaction.objectStore("tokens");

  let getRequest = objectStore.get(1);

  getRequest.onsuccess = function(event) {
    let existingToken = event.target.result;

    if (existingToken) {
      console.log("Token recuperado:", existingToken.token);
    } else {
      objectStore.add({ id: 1, token: token });
      console.log("Token adicionado:", token);
    }
  };

  getRequest.onerror = function(event) {
    console.error("Erro ao recuperar token:", event.target.errorCode);
  };
}
