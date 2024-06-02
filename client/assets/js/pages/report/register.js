import { zipCodeMask } from "../../utils.js";

const pokemonInput = document.querySelector("#pokemon");
const pokemonImg = document.querySelector("#pokemon-img");
const cepInput = document.querySelector("#cep");

const formSections = document.querySelectorAll(".form-section");

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

const getPokemonImage = async (id) => {
    id = id.toLowerCase();
    let res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    res = await res.json();
    return res["sprites"]["front_default"];

} 

pokemonInput.addEventListener("input", async (e) => {
    try{
        const pokemonImage = await getPokemonImage(e.target.value);
        pokemonImg.src = pokemonImage;
        if(e.target.value != "") return nextSection(2);
    } catch (e) {
        return previousSection(2);
    }
   
    if(e.target.value.length >= 2) return;
})

cepInput.addEventListener("keyup", (e) => {
    let input = e.target
    input.value = zipCodeMask(input.value)
})
