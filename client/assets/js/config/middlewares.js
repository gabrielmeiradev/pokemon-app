import { env } from "./env.js";

const fetchMiddleware = async () => {
    if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(env.CLIENT_URL + "/assets/js/config/sw.js");
          if (registration.installing) {
            console.log("Service worker sendo instalado");
          } else if (registration.waiting) {
            console.log("Service worker instalado");
          } else if (registration.active) {
            console.log("Service worker ativo");
          }
        } catch (error) {
          console.error(`Registro com erro: ${error}`);
        }
    }
}

export const middlewares = {
    _private: {
        fetch: fetchMiddleware
    },
    private: () =>  {
        Object.keys(middlewares._private).forEach((key) => {
            middlewares._private[key]()
        })
    }
}