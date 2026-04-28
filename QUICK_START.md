# Quick Start Guide

## Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- VS Code

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
python3 -m venv venv
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python3 src/main.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api/docs

## Features
- ✅ User Registration & Management
- ✅ Soil Analysis with AI Recommendations
- ✅ Disease Detection with Image Upload
- ✅ Weather Forecasting & Alerts
- ✅ Community Forum & Discussion
- ✅ Dual Language Support (English/Hindi)
- ✅ Responsive Mobile Design

## API Endpoints
- POST /api/users - Create user
- POST /api/soil/analyze - Analyze soil
- POST /api/disease/detect - Detect disease
- GET /api/weather/current/{location} - Get weather
- GET /api/community/posts - Get posts

## Troubleshooting
- Port conflicts: Change ports in vite.config.js and main.py
- CORS issues: Verify Flask-CORS configuration
- Database errors: Delete database file and restart backend

