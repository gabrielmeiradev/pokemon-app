import { env } from "../../config/env.js";

var map = L.map('map').setView([-23.5661786, -46.4725614], 12);

window.onload = () => {
    let locations;
    fetch(env.BASE_URL + "/locations")
        .then(res => res.json())
        .then(locations => {
            for(let location of locations) {
                console.log(location)
                fetch(`https://pokeapi.co/api/v2/pokemon/${location.pokemon_id}`)
                .then((res_pokemon) => res_pokemon.json())
                .then((pokemon) => {
                        var marker = L.marker([location.latitude, location.longitude]).addTo(map);
                        marker.bindPopup(`
                        <img src='${pokemon["sprites"]["front_default"]}' class='pokemon-in-map'>
                        <p>${pokemon.name}</p>
                        `).openPopup();
                    })
                
            }
        })

    
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="/">Pokemap</a>'
}).addTo(map);
