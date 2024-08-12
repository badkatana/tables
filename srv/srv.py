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
    accessibility: bool


class Role(BaseModel):
    roleName: str
    roleId: str
    description: str


PERSONS_FILE = "srv\persons.json"
ROLES_FILE = "srv\\roles.json"


def save_json(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)


def load_json(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)


def load_data():
    with open("srv\persons.json", "r") as file:
        return json.load(file)


def load_roles():
    with open("srv\\roles.json", "r") as file:
        return json.load(file)


@app.get("/users", response_model=Dict[str, List[User]])
async def get_users():
    data = load_json(PERSONS_FILE)
    return data


@app.get("/roles", response_model=List[Role])
async def get_roles():
    roles = load_json(ROLES_FILE)
    return roles


@app.put("/users/update/{user_id}", response_model=User)
async def update_user(user_new: User):
    print(user_new)
    try:
        users_data = load_json(PERSONS_FILE)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Users file not found")

    users_list = users_data.get("results", [])

    for index, existing_user in enumerate(users_list):
        if existing_user['id'] == user_new.id:
            for key, value in user_new.model_dump().items():
                if value is not None:
                    existing_user[key] = value
            save_json(PERSONS_FILE, {"results": users_list})
            return existing_user

    raise HTTPException(status_code=404, detail="User not found")


@app.put("/users/{user_ids}", response_model=Dict[str, List[User]])
async def update_roles_users(user_ids: str, role: str):
    data = load_json(PERSONS_FILE)
    ids = user_ids.split(",")
    updated_users = []

    for user in data["results"]:
        if user["id"] in ids:
            user["role"] = role
            updated_users.append(user)

    if not updated_users:
        raise HTTPException(status_code=404, detail="Users not found")

    save_json(PERSONS_FILE, data)

    return {"results": updated_users}


@app.put("/roles/edit", response_model=List[Role])
async def update_roles(role: Role):
    users = load_json(PERSONS_FILE)
    roles = load_json(ROLES_FILE)

    old_role_name = next((oldRole['roleName'] for oldRole in roles if oldRole.get(
        'roleId') == role.roleId), None)

    roles = [oldRole for oldRole in roles if oldRole.get(
        'roleId') != role.roleId]

    roles.append(role.model_dump())

    if old_role_name:
        for user in users["results"]:
            if user["role"] == old_role_name:
                user['role'] = role.roleName
    roles = sorted(roles, key=lambda x: x['roleId'])
    save_json(PERSONS_FILE, users)
    save_json(ROLES_FILE, roles)

    return roles


@app.delete("/users/{user_id}")
def delete_user(user_id: str):
    data = load_json(PERSONS_FILE)
    results = data["results"]

    updated_results = [user for user in results if user["id"] != user_id]

    if len(updated_results) == len(results):
        raise HTTPException(status_code=404, detail="User not found")

    data["results"] = updated_results
    save_json(PERSONS_FILE, data)

    return data


@app.delete("/roles/{role_id}", response_model=List[Role])
def delete_role(role_id: str):
    roles = load_json(ROLES_FILE)
    users = load_json(PERSONS_FILE)
    updated_roles = [role for role in roles if role["roleId"] != role_id]
    role_name = next((oldRole['roleName'] for oldRole in roles if oldRole.get(
        'roleId') == role_id), None)

    for user in users["results"]:
        if user["role"] == role_name:
            user['role'] = ""

    if len(updated_roles) == len(roles):
        raise HTTPException(status_code=404, detail="Role not found")
    save_json(ROLES_FILE, updated_roles)
    save_json(PERSONS_FILE, users)
    return updated_roles


@app.post("/roles/create")
def create_role(role: Role):
    roles = load_json(ROLES_FILE)
    roles.append(role.model_dump())
    save_json(ROLES_FILE, roles)

    return roles


uvicorn.run(app, port=8000)
