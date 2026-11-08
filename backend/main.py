from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv
import json
import os
import shutil

from ai import ask_ai, AINotConfigured

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
SEED_DEVICES_FILE = os.path.join(DATA_DIR, "devices.json")

# Vercel's file system is read-only except /tmp, so there the device list is
# copied to /tmp and changes are saved to that copy. Changes there last only as
# long as the serverless instance, so they can reset after a while.
if os.environ.get("VERCEL"):
    DEVICES_FILE = "/tmp/devices.json"
    if not os.path.exists(DEVICES_FILE):
        shutil.copyfile(SEED_DEVICES_FILE, DEVICES_FILE)
else:
    DEVICES_FILE = SEED_DEVICES_FILE


class ChatRequest(BaseModel):
    question: str


class DeviceUpdate(BaseModel):
    status: str
    usage: int


@app.get("/")
def home():
    return {"message": "EcoMind AI Backend Running"}


@app.get("/devices")
def get_devices():
    with open(DEVICES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@app.put("/devices/{device_id}")
def update_device(device_id: int, device: DeviceUpdate):

    with open(DEVICES_FILE, "r", encoding="utf-8") as f:
        devices = json.load(f)

    for d in devices:
        if d["id"] == device_id:
            d["status"] = device.status
            d["usage"] = device.usage
            break
    else:
        raise HTTPException(status_code=404, detail="Device not found")

    with open(DEVICES_FILE, "w", encoding="utf-8") as f:
        json.dump(devices, f, indent=2)

    return {"message": "Device updated successfully"}


@app.get("/energy")
def get_energy():
    with open(os.path.join(DATA_DIR, "energy.csv"), newline="", encoding="utf-8") as f:
        return [
            {"day": row["day"], "usage": float(row["usage"])}
            for row in csv.DictReader(f)
        ]


@app.post("/chat")
def chat(data: ChatRequest):

    try:
        answer = ask_ai(data.question)
    except AINotConfigured:
        raise HTTPException(
            status_code=503,
            detail="AI isn't set up: add GROQ_API_KEY to the server's environment.",
        )

    return {
        "reply": answer
    }