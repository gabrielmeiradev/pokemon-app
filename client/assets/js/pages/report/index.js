import { getToken } from "../../config/db.js";
import { env } from "../../config/env.js";
import { loadDependencies } from "../../index.js";
import { zipCodeMask } from "../../utils.js";

const pokemonInput = document.querySelector("#pokemon");
const pokemonImg = document.querySelector("#pokemon-img");
const cepInput = document.querySelector("#cep");
const numeroInput = document.querySelector("#numero");
const reportButton = document.querySelector("#report-btn");
const form = document.querySelector("#form");
const formSections = document.querySelectorAll(".form-section");

const formBody = {
    user_token: "",
    pokemon_id: "",
    cep: "",
    logradouro: "",
    numero: "",
    cidade: "",
    uf: ""
}


window.onload = async () => {
    await loadDependencies(true);
    formBody.user_token = await getToken();
}



const nextSection = (number = 1) => {
    for(let f of formSections){
        if(!f.classList.contains("active")){
            f.classList.add("active");
            number--;
            if (number == 0) break;
        }
    }
}

const previousSection = (number = 1) => {
    for(var i = formSections.length - 1; i >= 0; i--){
        let formSection = formSections[i]
        if(formSection.classList.contains("active")) {
            formSection.classList.remove("active");
        }
        number--;
        if(number == 0) break;
    }
}

const setPokemonDetails = async (id) => {
    id = id.toLowerCase();
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    res = await res.json();

    const pokemon = {
        id: res.id,
        image: res["sprites"]["front_default"]
    }

    formBody.pokemon_id = String(pokemon.id);

    pokemonImg.src = pokemon.image;
} 

pokemonInput.addEventListener("input", async (e) => {
    try {
        await setPokemonDetails(e.target.value);
        if(e.target.value != "") return nextSection(2);
    } catch (e) {
        return previousSection(2);
    }
   
    if(e.target.value.length >= 2) return;
})

numeroInput.addEventListener("change", (e) => {
    formBody.numero = e.target.value
})

cepInput.addEventListener("keyup", (e) => {
    let input = e.target;
    input.value = zipCodeMask(input.value);
    if(input.value.length >= 9) {
        fetch(`https://viacep.com.br/ws/${input.value.replace("-", "")}/json/`)
            .then((res) => res.json())
            .then((data) => {
                formBody.logradouro = data["logradouro"] 
                formBody.cidade = data["localidade"] 
                formBody.uf = data["uf"] 
                formBody.cep = input.value
            })
    }
})

form.addEventListener("input", () => {
    const isValid = form.checkValidity();
    if(isValid) {
        reportButton.disabled = false;
    }
})

form.addEventListener("submit", (e) => {
    e.preventDefault()
    fetch(env.SERVER_URL + "/location", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formBody)
    })
    .then((res) => res.json())
    .then((data) => {
        location.href = "map.html"
    })
})
