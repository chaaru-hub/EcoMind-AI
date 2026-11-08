# Vercel serverless entry point: serves the FastAPI backend under /api.
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from fastapi import FastAPI  # noqa: E402
from main import app as backend  # noqa: E402

app = FastAPI()
app.mount("/api", backend)
