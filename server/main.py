from typing import Optional, Union
from db import users, pokemons_locations
from fastapi import FastAPI
from pydantic import BaseModel
import bcrypt
import jwt
import uuid
from fastapi.middleware.cors import CORSMiddleware
from geopy.geocoders import Nominatim
from geopy.extra.rate_limiter import RateLimiter

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def hello():
    return {"ping": "pong"}

# register and login logics

class User(BaseModel):
    email: str
    password: str

@app.post("/register")
async def register(user: User):
    user_found = users.find_one({"email": user.email})
    if user_found: return {"message": "Usuário já cadastrado", "status": "error"}

    hashed_pass = bcrypt.hashpw(user.password.encode("utf8"), bcrypt.gensalt())
    user_dict = {"email": user.email, "password": hashed_pass}
    users.insert_one(user_dict)

    return {"message": "Usuário criado com sucesso"}

@app.post("/login")
async def login(user: User):
    user_found = users.find_one({"email": user.email})

    if not user_found:
        return {"message": "Usuário não encontrado", "status": "error"}

    if bcrypt.checkpw(user.password.encode("utf8"), user_found["password"]):
        jwt_token = jwt.encode({"email": user.email}, "secret", algorithm="HS256")
        return {"message": "Usuário logado", "token": jwt_token, "status": "success"}
    
    return {"message": "Senha incorreta", "status": "error"}
    
# pokemon register logics

class PokemonLocation(BaseModel):
    user_id: str
    pokemon_id: str
    logradouro: str
    bairro: str
    cidade: str
    uf: str


@app.post("/location")
async def insert_location(location: PokemonLocation):
    geolocator = Nominatim(user_agent="pokemap")
    location = geolocator.geocode(location.logradouro + ", " + location.bairro + ", " + location.cidade + " - " + location.uf)
    print(str(location))

    latitude = 2 # todo
    longitude = 3 # todo
    # location_dict = {
    #     "user_id": location.user_id,
    #     "location_id": str(uuid.uuid4()),
    #     "pokemon_id": location.pokemon_id,
    #     "latitude": latitude,
    #     "longitude": longitude
    # }

    # pokemons_locations.insert_one(location_dict)
    return {"message": "Report inserido", "status": "success"}

@app.delete("/location/{id}")
async def delete_location(id):
    pokemons_locations.delete_one({"location_id": id})
    return {"message": "Report deletado", "status": "success"}

@app.put("/location/{id}")
async def update_location(id, location: PokemonLocation):
    filter = { "location_id": id }
    new_values = { "$set": {
        "user_id": location.user_id,
        "pokemon_id": location.pokemon_id,
        "latitude": location.latitude,
        "longitude": location.longitude
    }}

    pokemons_locations.update_one(filter, new_values)
    return {"message": "Pokemon atualizado", "status": "success"}

@app.get("/location/{id}")
async def update_location(id):
    pokemon_location = pokemons_locations.find_one({"location_id": id}, {"_id": 0})
    return pokemon_location 



