# 🌿 EcoMind AI

> **AI-Powered Smart Energy Management System**

EcoMind AI is an AI-powered Smart Energy Management System that helps users monitor electricity consumption, manage smart devices, analyze energy usage, and receive intelligent energy-saving recommendations.

The platform combines an interactive dashboard, energy analytics, smart device management, and an AI assistant into a single web application to promote efficient, cost-effective, and sustainable energy usage.

---

# 📸 Project Preview

> Add screenshots of your application here.

- 🏠 Dashboard
- 📊 Analytics
- 🔌 Smart Devices
- 📜 Energy History
- ⚙️ Settings
- 🤖 AI Assistant

---

# ✨ Features

- 📊 Interactive Energy Dashboard
- 📈 Weekly Energy Analytics
- 🔌 Smart Device Monitoring & Control
- 🤖 AI-Powered Energy Assistant
- 💰 Monthly Electricity Bill Prediction
- 🌱 Carbon Emission Tracking
- 📜 Energy History
- ⚙️ User Settings & Budget Management
- 🔍 Device Search
- 💾 Persistent Device Status (Backend Storage)

---

# 🛠️ Technology Stack

## Frontend
- React.js
- Vite
- CSS3
- React Router
- Recharts

## Backend
- Python
- FastAPI
- REST API

## Artificial Intelligence
- Groq API
- Llama 3.3 70B Versatile

## Data Storage
- JSON
- CSV

## Tools
- Git
- GitHub
- VS Code

---

# 🏗️ Project Architecture

```text
                 User

                   │

                   ▼

          React Frontend (Vite)

                   │

            REST API Requests

                   │

             FastAPI Backend

        ┌──────────┴──────────┐

        │                     │

   devices.json         energy.csv

                   │

                   ▼

              Groq AI API

                   │

                   ▼

       AI Energy Recommendations
```

---

# 📂 Project Structure

```text
EcoMind-AI/

│
├── backend/
│   ├── main.py
│   ├── ai.py
│   ├── requirements.txt
│
├── data/
│   ├── devices.json
│   └── energy.csv
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── layout/
│   │   └── styles/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

# 🚀 Installation

## Clone the Repository

```bash
git clone https://github.com/chaaru-hub/EcoMind-AI.git

cd EcoMind-AI
```

---

# ⚙️ Backend Setup

```bash
cd backend

python -m venv .venv
```

### Activate Virtual Environment

**Windows**

```bash
.venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Create a `.env` file

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

### Start the Backend

```bash
uvicorn main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

# 💻 Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run the application

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

# 🔗 API Endpoints

## Get Smart Devices

```
GET /devices
```

Returns all smart devices.

---

## Get Energy Data

```
GET /energy
```

Returns energy usage data.

---

## AI Chat

```
POST /chat
```

### Example Request

```json
{
  "question": "How can I reduce my electricity bill?"
}
```

### Example Response

```json
{
  "reply": "Use LED lighting, turn off unused appliances, optimize thermostat settings, and reduce standby power consumption to lower electricity costs."
}
```

---

# 📱 Application Pages

## 🏠 Dashboard

Displays:

- Current Energy Usage
- Today's Bill
- CO₂ Saved
- Weekly Energy Chart
- Smart Insights
- Monthly Bill Prediction
- Connected Devices

---

## 📊 Analytics

Provides:

- Energy Consumption Trends
- Interactive Charts
- AI Insights
- Usage Statistics

---

## 🔌 Smart Devices

Allows users to:

- Turn Devices ON/OFF
- Search Devices
- Monitor Power Consumption
- View Online & Offline Devices
- Calculate Total Power Usage

---

## 📜 History

Displays:

- Previous Energy Usage
- Electricity Cost
- Carbon Savings
- CSV Export

---

## ⚙️ Settings

Includes:

- User Preferences
- Monthly Budget
- Notifications
- Appearance Settings
- AI Preferences

---

## 🤖 AI Assistant

Users can ask questions such as:

- How can I reduce my electricity bill?
- Which appliance consumes the most electricity?
- Give me energy-saving tips.
- How can I reduce carbon emissions?

The AI assistant provides intelligent recommendations using the Groq API and Llama 3.3 model.

---

# 🌍 Applications

- Smart Homes
- Offices
- Educational Institutions
- Apartments
- Smart Cities
- Energy Monitoring Systems

---

# 🚀 Future Enhancements

- IoT Device Integration
- User Authentication
- Cloud Database
- Mobile Application
- Voice Assistant Support
- Renewable Energy Monitoring
- Smart Automation Rules
- Real-Time Notifications

---

# 📜 License

This project is developed for educational, learning, and demonstration purposes.

---

⭐ **If you found this project helpful, consider giving it a star on GitHub!**