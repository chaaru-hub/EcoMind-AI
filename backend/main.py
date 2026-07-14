from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import pandas as pd
import os

from ai import ask_ai

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
DEVICES_FILE = os.path.join(DATA_DIR, "devices.json")


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

    with open(DEVICES_FILE, "w", encoding="utf-8") as f:
        json.dump(devices, f, indent=2)

    return {"message": "Device updated successfully"}


@app.get("/energy")
def get_energy():
    df = pd.read_csv(
        os.path.join(DATA_DIR, "energy.csv")
    )
    return df.to_dict(orient="records")


@app.post("/chat")
def chat(data: ChatRequest):

    answer = ask_ai(data.question)

    return {
        "reply": answer
    }