import { getToken } from "../../config/db.js";
import { env } from "../../config/env.js";
import { loadDependencies } from "../../index.js";
import { parseJwt, relativeTime } from "../../utils.js";

var map = L.map('map').setView([-23.5661786, -46.4725614], 12);

window.onload = async () => {

    loadDependencies(true);
    let token = await getToken();

    const parsedToken = parseJwt(token);

    let locations;
    fetch(env.SERVER_URL + "/locations")
        .then(res => res.json())
        .then(locations => {
            let fetchPromises = [];
            for(let location of locations) {
                fetchPromises.push(
                    fetch(`https://pokeapi.co/api/v2/pokemon/${location.pokemon_id}`)
                        .then((res_pokemon) => res_pokemon.json())
                        .then((pokemon) => {
                            let isFromLoggedUser = location.user_id == parsedToken.user_id
                            var marker = L.marker([location.latitude, location.longitude]).addTo(map);
                            marker.bindPopup(`
                            ${isFromLoggedUser ? `<a href='edit.html?location_id=${location._id}'>` : ""}
                                <div class="text-center">
                                    ${isFromLoggedUser ? "Por <b>você</b> <br />" : ""}
                                    <img src='${pokemon.sprites.front_default}' class='pokemon-in-map'>
                                    <p class='pokemon-map-name'>${pokemon.name}</p>
                                    <span class="pokemon-location-time">${relativeTime(location.datetime)}</span><br />
                                </div>
                            ${isFromLoggedUser ? "</a>" : ""}
                            `).openPopup();
                        })
                );
            }
            return Promise.all(fetchPromises);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="/">Pokemap</a>'
}).addTo(map);
