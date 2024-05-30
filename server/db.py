import pymongo
client = pymongo.MongoClient("mongodb://localhost:27017/")
database = client["pokemap"]

users = database["users"]
pokemons_locations = database["pokemons_locations"]