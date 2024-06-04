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

export function getToken() {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(["tokens"], "readonly");
    let objectStore = transaction.objectStore("tokens");

    let getRequest = objectStore.get(1);

    getRequest.onsuccess = function(event) {
      let existingToken = event.target.result;

      if (existingToken && existingToken.token) {
        console.log("Token recuperado:", existingToken.token);
        resolve(existingToken.token);
      } else {
        console.log("Token não encontrado");
        reject("Token não encontrado");
      }
    };

    getRequest.onerror = function(event) {
      console.error("Erro ao recuperar token:", event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
}

export function setToken(token) {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(["tokens"], "readwrite");
    let objectStore = transaction.objectStore("tokens");

    let getRequest = objectStore.get(1);

    getRequest.onsuccess = function(event) {
      let existingToken = event.target.result;

      if (existingToken && existingToken.token) {
        console.log("Token já existe:", existingToken.token);
        reject("Token já existe");
      } else {
        objectStore.add({ id: 1, token: token });
        console.log("Token adicionado:", token);
        resolve(token);
      }
    };

    getRequest.onerror = function(event) {
      console.error("Erro ao recuperar token:", event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
}
