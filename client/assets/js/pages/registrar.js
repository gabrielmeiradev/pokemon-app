import { env } from "../config/env.js";
import { showToast } from "../utils.js";

const form = document.querySelector("#form");

const register = (email, password) => {
    const endpoint = `${env.SERVER_URL}/register`
    fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })
    .then((res) => res.json())
    .then((data) => {
        showToast(data.message)
        location.href="login.html"
    })
    .catch(() => {
        showToast("Erro ao tentar entrar, tente novamente mais tarde")
    })
    
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const password2Input = document.querySelector("#password-2");

    if(passwordInput.value != password2Input.value) {
        return showToast("Senhas diferentes")
    }

    register(emailInput.value, passwordInput.value)
})
