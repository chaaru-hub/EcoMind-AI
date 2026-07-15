# 🌿 EcoMind AI

**EcoMind AI** is an AI-powered Smart Energy Management System that helps users monitor electricity consumption, manage smart devices, analyze energy usage, and receive intelligent energy-saving recommendations.

The application combines interactive dashboards, smart device control, energy analytics, and AI-powered assistance into a single web platform that promotes efficient and sustainable energy usage.

---

## 📸 Project Preview

> Add screenshots of your application here.

- Dashboard
- Analytics
- Smart Devices
- Energy History
- Settings
- AI Assistant

---

## ✨ Features

- 📊 Interactive Energy Dashboard
- 📈 Weekly Energy Analytics
- 🔌 Smart Device Monitoring & Control
- 🤖 AI-Powered Energy Assistant
- 💰 Monthly Electricity Bill Prediction
- 🌱 Carbon Emission Tracking
- 📜 Energy History
- ⚙ User Settings & Budget Management
- 🔍 Device Search
- 💾 Persistent Device Status (Backend Storage)

---

## 🛠 Technology Stack

### Frontend
- React.js
- Vite
- CSS3
- React Router
- Recharts

### Backend
- Python
- FastAPI
- REST API

### Artificial Intelligence
- Groq API
- Llama 3.3 70B Versatile

### Data Storage
- JSON
- CSV

### Version Control
- Git
- GitHub

---

# 🏗 Project Architecture

```
                User

                  │

                  ▼

         React Frontend (Vite)

                  │

          REST API Requests

                  │

           FastAPI Backend

        ┌─────────┴─────────┐

        │                   │

   devices.json       energy.csv

                  │

                  ▼

             Groq AI API

                  │

                  ▼

      AI Energy Recommendations
```

---

# 📂 Project Structure

```
EcoMind-AI/

│
├── backend/
│   ├── main.py
│   ├── ai.py
│   ├── devices.py
│   └── requirements.txt
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

## Clone Repository

```bash
git clone https://github.com/chaaru-hub/EcoMind-AI.git

cd EcoMind-AI
```

---

# Backend Setup

```bash
cd backend

python -m venv .venv
```

### Windows

```bash
.venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Create a `.env` file

```env
GROQ_API_KEY=YOUR_API_KEY
```

### Start Backend

```bash
uvicorn main:app --reload
```

Backend runs at:

```
http://127.0.0.1:8000
```

---

# Frontend Setup

Open another terminal.

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run application

```bash
npm run dev
```

Frontend runs at

```
http://localhost:5173
```

---

# API Endpoints

## Get Devices

```
GET /devices
```

Returns all smart devices.

---

## Get Energy Data

```
GET /energy
```

Returns weekly energy usage.

---

## AI Chat

```
POST /chat
```

Example Request

```json
{
  "question":"How can I reduce my electricity bill?"
}
```

Example Response

```json
{
  "reply":"Use LED bulbs, turn off unused appliances, and optimize thermostat settings to save energy and reduce electricity costs."
}
```

---

# Screens

## 🏠 Dashboard

Displays

- Current Usage
- Today's Bill
- Carbon Saved
- Devices Online
- Smart Insights
- Weekly Usage Chart

---

## 📈 Analytics

Displays

- Monthly Trends
- Energy Charts
- AI Insights
- Usage Statistics

---

## 🔌 Devices

Users can

- Turn devices ON/OFF
- Search devices
- Monitor power consumption
- View online/offline devices

---

## 📜 History

Displays

- Previous Energy Usage
- Cost
- Carbon Saved
- CSV Download

---

## ⚙ Settings

Includes

- User Profile
- Monthly Budget
- Notifications
- Appearance
- AI Preferences

---

## 🤖 AI Assistant

Users can ask questions such as

- How can I reduce my electricity bill?
- Which appliance consumes the most power?
- Give me energy-saving tips.
- How can I reduce carbon emissions?

The assistant provides practical AI-generated recommendations.

---

# Future Enhancements

- IoT Device Integration
- Cloud Database
- User Authentication
- Mobile Application
- Voice Assistant Support
- Real-Time Notifications
- Machine Learning Forecasting
- Smart Automation Rules

---

# Applications

- Smart Homes
- Offices
- Colleges
- Apartments
- Smart Cities
- Energy Monitoring Systems

---

# Author

**Chaaru Seelan**

---

# License

This project is developed for educational and demonstration purposes.

---

⭐ If you like this project, consider giving it a star on GitHub!
