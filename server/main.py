from typing import Union
from db import users
from fastapi import FastAPI
from pydantic import BaseModel
import bcrypt
import jwt

app = FastAPI()

class User(BaseModel):
    email: str
    password: str

@app.get("/")
def hello():
    return {"ping": "pong"}

@app.post("/register")
async def register(user: User):
    userFound = users.find_one({"email": user.email})
    if userFound: return {"message": "Usuário já cadastrado"}

    hashed_pass = bcrypt.hashpw(user.password.encode("utf8"), bcrypt.gensalt())
    user_dict = {"email": user.email, "password": hashed_pass}
    users.insert_one(user_dict)

    return {"message": "Usuário criado com sucesso"}

@app.post("/login")
async def login(user: User):
    userFound = users.find_one({"email": user.email})

    if not userFound:
        return {"message": "Usuário não encontrado"}

    if bcrypt.checkpw(user.password.encode("utf8"), userFound["password"]):
        jwt_token = jwt.encode({"email": user.email}, "secret", algorithm="HS256")
        return {"message": "Usuário logado", "token": jwt_token}
    
    return {"message": "Senha incorreta"}
    
    

