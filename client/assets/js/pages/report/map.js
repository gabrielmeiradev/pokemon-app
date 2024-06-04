import { env } from "../../config/env.js";
import { relativeTime } from "../../utils.js";

var map = L.map('map').setView([-23.5661786, -46.4725614], 12);

window.onload = () => {
    let locations;
    fetch(env.BASE_URL + "/locations")
        .then(res => res.json())
        .then(locations => {
            locations = locations.toReversed()
            for(let location of locations) {
                console.log(location)
                fetch(`https://pokeapi.co/api/v2/pokemon/${location.pokemon_id}`)
                .then((res_pokemon) => res_pokemon.json())
                .then((pokemon) => {
                    console.log(pokemon)
                        var marker = L.marker([location.latitude, location.longitude]).addTo(map);
                        marker.bindPopup(`
                        <div class="text-center">
                            <img src='${pokemon["sprites"]["front_default"]}' class='pokemon-in-map'>
                            <p class='pokemon-map-name'>${pokemon.name}</p>
                            <span class="pokemon-location-time">${relativeTime(location["datetime"])}</span>
                        </div>
                        `).openPopup();
                    })
                
            }
        })

    
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="/">Pokemap</a>'
}).addTo(map);
