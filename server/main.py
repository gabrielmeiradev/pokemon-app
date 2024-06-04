from typing import Optional, Union
from db import users, pokemons_locations
from fastapi import FastAPI
from pydantic import BaseModel
import bcrypt
import jwt
import uuid
from fastapi.middleware.cors import CORSMiddleware
from opencage.geocoder import OpenCageGeocode
import json
from datetime import datetime

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

JWT_SECRET = "secret"

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
        jwt_token = jwt.encode({"email": user.email}, JWT_SECRET, algorithm="HS256")
        print(jwt_token)
        return {"message": "Usuário logado", "token": jwt_token, "status": "success"}
    
    return {"message": "Senha incorreta", "status": "error"}
    
# pokemon register logics

OPEN_CAGE_kEY = "d2a0a2ad9eff46448e031fff773fd5ec"
class PokemonLocation(BaseModel):
    user_token: str
    pokemon_id: str
    logradouro: str
    numero: str
    cidade: str
    uf: str


@app.post("/location")
async def insert_location(l: PokemonLocation):
    geocoder = OpenCageGeocode(OPEN_CAGE_kEY)
    query = f"{l.logradouro}, {l.numero} - {l.cidade} - {l.uf}"
    results = geocoder.geocode(query)
    longitude = str(results[0]['geometry']['lng'])
    latitude = str(results[0]['geometry']['lat'])

    user_email = jwt.decode(l.user_token, JWT_SECRET, algorithms="HS256")["email"]

    user_id = users.find_one({"email": user_email})["_id"]

    p_l_dict = {
       "user_id": str(user_id),
       "pokemon_id": l.pokemon_id,
       "latitude": latitude,
       "longitude": longitude,
       "datetime": datetime.now()
    }

    pokemons_locations.insert_one(p_l_dict)
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

@app.get("/locations")
async def get_all_locations():
    result = pokemons_locations.find({}, {'_id': 0})
    out = []
    for location in result:
        out.append(location)
    return out

@app.get("/location/{id}")
async def update_location(id):
    pokemon_location = pokemons_locations.find_one({"location_id": id}, {"_id": 0})
    return pokemon_location 



