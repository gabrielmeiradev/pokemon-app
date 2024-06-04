import { getToken } from "../../config/db.js";
import { env } from "../../config/env.js";

const urlParams = new URLSearchParams(window.location.search);
const location_id = urlParams.get("location_id");

const form = document.querySelector("#form");
const pokemonInput = document.querySelector("#pokemon");
const pokemonImg = document.querySelector("#pokemon-img");
const cepInput = document.querySelector("#cep");
const numeroInput = document.querySelector("#numero");


const formBody = {
    user_token: "",
    pokemon_id: "",
    cep: "",
    logradouro: "",
    numero: "",
    cidade: "",
    uf: ""
}

const setPokemonDetails = async (id) => {
    id = id.toLowerCase();
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    res = await res.json();

    const pokemon = {
        id: res.id,
        name: res.name,
        image: res["sprites"]["front_default"]
    }

    formBody.pokemon_id = id;
    pokemonInput.value = pokemonInput.value == "" ? pokemon.name : pokemonInput.value;
    pokemonImg.src = pokemon.image;
} 

window.onload = () => {
    fetch(`${env.SERVER_URL}/location/${location_id}`)
        .then((res) => res.json())
        .then(async (location) => {
            cepInput.value = location.cep;
            numeroInput.value = location.numero;
            setPokemonDetails(location.pokemon_id);

        })
}

pokemonInput.addEventListener("input", async (e) => {
    try {
        await setPokemonDetails(e.target.value);
    } catch (e) {
        return console.log(e);
    }
})

form.addEventListener("submit", async (e) => {
    e.preventDefault();


    let cepValue = document.querySelector("#cep").value
    formBody.cep = cepValue;
    
    let numeroValue = document.querySelector("#numero").value;
    
    formBody.numero = numeroValue;
    formBody.user_token = await getToken();

    if(cepValue.length >= 9) {
        fetch(`https://viacep.com.br/ws/${cepValue.replace("-", "")}/json/`)
            .then((res) => res.json())
            .then((data) => {
                formBody.logradouro = data["logradouro"] 
                formBody.cidade = data["localidade"] 
                formBody.uf = data["uf"] 

                fetch(`${env.SERVER_URL}/location/${location_id}`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formBody)
                })
                .then((res) => res.json())
                .then(() => {
                    console.log(formBody)
                    location.href = "map.html"
                })
            })
    }

    
})
