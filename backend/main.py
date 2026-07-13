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


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {"message": "EcoMind AI Backend Running"}


@app.get("/devices")
def get_devices():

    with open(
        os.path.join(DATA_DIR, "devices.json"),
        "r",
        encoding="utf-8"
    ) as f:
        return json.load(f)


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