from datetime import date
from typing import Dict, List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

profiles: Dict[str, dict] = {}
checkins: Dict[str, List[dict]] = {}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/profile")
def save_profile(profile: dict):
    user_id = profile.get("user_id", "demo")
    profiles[user_id] = profile
    return profile


@app.get("/profile/{user_id}")
def get_profile(user_id: str):
    return profiles.get(user_id, {})


@app.post("/checkin")
def create_checkin(checkin: dict):
    user_id = checkin.get("user_id", "demo")
    user_list = checkins.setdefault(user_id, [])
    user_list.append(checkin)
    return checkin


@app.get("/checkin/{user_id}")
def get_checkins(user_id: str):
    return checkins.get(user_id, [])