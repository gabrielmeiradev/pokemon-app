import { env } from "../env.js";
import { showToast } from "../utils.js";

const form = document.querySelector("#form");

const login = (email, password) => {
    const endpoint = `${env.BASE_URL}/login`
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
    })
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");

    login(emailInput.value, passwordInput.value)
})
