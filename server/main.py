from typing import Optional, Union
from db import users, pokemons_locations
from fastapi import FastAPI
from pydantic import BaseModel
import bcrypt
import jwt
import uuid
from fastapi.middleware.cors import CORSMiddleware

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
    if user_found: return {"message": "Usuário já cadastrado"}

    hashed_pass = bcrypt.hashpw(user.password.encode("utf8"), bcrypt.gensalt())
    user_dict = {"email": user.email, "password": hashed_pass}
    users.insert_one(user_dict)

    return {"message": "Usuário criado com sucesso"}

@app.post("/login")
async def login(user: User):
    user_found = users.find_one({"email": user.email})

    if not user_found:
        return {"message": "Usuário não encontrado"}

    if bcrypt.checkpw(user.password.encode("utf8"), user_found["password"]):
        jwt_token = jwt.encode({"email": user.email}, "secret", algorithm="HS256")
        return {"message": "Usuário logado", "token": jwt_token}
    
    return {"message": "Senha incorreta"}
    
# pokemon register logics

class PokemonLocation(BaseModel):
    pokemon_id: str
    latitude: float
    longitude: float


@app.post("/location")
async def insert_location(location: PokemonLocation):
    location_dict = {
        "location_id": str(uuid.uuid4()),
        "pokemon_id": location.pokemon_id,
        "latitude": location.latitude,
        "longitude": location.longitude
    }

    pokemons_locations.insert_one(location_dict)
    return {"message": "Report inserido"}

@app.delete("/location/{id}")
async def delete_location(id):
    pokemons_locations.delete_one({"location_id": id})
    return {"message": "Report deletado"}

@app.put("/location/{id}")
async def update_location(id, location: PokemonLocation):
    filter = { "location_id": id }
    new_values = { "$set": {
        "pokemon_id": location.pokemon_id,
        "latitude": location.latitude,
        "longitude": location.longitude
    }}

    pokemons_locations.update_one(filter, new_values)
    return {"message": "Pokemon atualizado"}

@app.get("/location/{id}")
async def update_location(id):
    pokemon_location = pokemons_locations.find_one({"location_id": id}, {"_id": 0})
    return pokemon_location 



