from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    # Замените "*" на список разрешенных доменов в продакшн среде
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Name(BaseModel):
    title: str
    first: str
    last: str


class Location(BaseModel):
    city: str
    state: str
    country: str


class DOB(BaseModel):
    date: str
    age: int


class User(BaseModel):
    gender: str
    name: Name
    location: Location
    email: str
    dob: DOB
    phone: str
    cell: str
    id: str
    role: Optional[str] = None


class Role(BaseModel):
    roleName: str
    roleId: str


def load_data():
    with open("srv\persons.json", "r") as file:
        return json.load(file)


def load_roles():
    with open("srv\\roles.json", "r") as file:
        return json.load(file)


data = load_data()
roles = load_roles()


@app.get("/users", response_model=Dict[str, List[User]])
async def get_users():
    return data


@app.get("/roles", response_model=List[Role])
async def get_roles():
    return roles


@app.put("/users/{user_ids}", response_model=Dict[str, List[User]])
async def update_roles(user_ids: str, role: str):
    print(role)
    ids = user_ids.split(",")
    updated_users = []

    for user in data["results"]:
        if user["id"] in ids:
            user["role"] = role
            updated_users.append(user)

    if not updated_users:
        raise HTTPException(status_code=404, detail="Users not found")

    return {"results": updated_users}


@app.put("/roles/{role_id}", response_model=Dict[str, List[Role]])
async def update_roles(role_id: str, role: str):
    return "success"


uvicorn.run(app, port=8000)
