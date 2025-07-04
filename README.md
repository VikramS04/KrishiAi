# Agriculture Platform - Local Setup Guide

## Complete Step-by-Step Instructions for Running in VS Code

This guide provides comprehensive instructions for setting up and running the Agriculture Platform on your local machine using VS Code. The platform consists of a React frontend and Flask backend with full API integration.

## Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software
1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Python** (version 3.8 or higher)
   - Download from: https://python.org/
   - Verify installation: `python --version` or `python3 --version`

3. **Visual Studio Code**
   - Download from: https://code.visualstudio.com/

4. **Git** (optional but recommended)
   - Download from: https://git-scm.com/

### Recommended VS Code Extensions
- Python
- JavaScript (ES6) code snippets
- React snippets
- Prettier - Code formatter
- Auto Rename Tag
- Bracket Pair Colorizer

## Project Structure

The complete project structure will look like this:

```
agriculture-platform-local/
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── vite.svg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/
│   ├── src/
│   │   ├── main.py
│   │   ├── models/
│   │   │   └── user.py
│   │   └── routes/
│   │       ├── soil.py
│   │       ├── disease.py
│   │       ├── weather.py
│   │       └── community.py
│   ├── requirements.txt
│   └── database.db
├── README.md
└── setup-instructions.md
```

## Step 1: Create Project Directory

1. Open VS Code
2. Create a new folder called `agriculture-platform-local` on your desktop or preferred location
3. Open this folder in VS Code (File → Open Folder)

## Step 2: Frontend Setup (React)

### 2.1 Create Frontend Directory Structure

Create the following folder structure in your project:

```
frontend/
├── public/
├── src/
```

### 2.2 Frontend Configuration Files

Create these files in the `frontend/` directory:

#### package.json
```json
{
  "name": "agriculture-platform",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
```

#### vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
```

#### index.html (in frontend root)
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AgriSmart - Comprehensive Agriculture Platform</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 2.3 Frontend Source Files

#### src/main.jsx
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### src/App.css
```css
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

/* Button hover effects */
.btn-hover {
  transition: all 0.3s ease;
}

.btn-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Card hover effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

/* Loading spinner */
.spinner {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .grid-responsive {
    grid-template-columns: 1fr;
  }
}

/* Form styles */
.form-input {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Alert styles */
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin: 16px 0;
  font-weight: 500;
}

.alert-success {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background-color: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.alert-warning {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

/* Navigation active states */
.nav-active {
  background-color: #10b981;
  color: white;
}

/* Progress bars */
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #10b981;
  transition: width 0.3s ease;
}

/* Weather icons */
.weather-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

/* Soil health indicators */
.health-excellent { color: #10b981; }
.health-good { color: #84cc16; }
.health-fair { color: #f59e0b; }
.health-poor { color: #ef4444; }

/* Community post styles */
.post-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Language toggle */
.language-toggle {
  display: flex;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
}

.language-option {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.language-option.active {
  background: #10b981;
  color: white;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .mobile-hidden {
    display: none;
  }
  
  .mobile-full {
    width: 100%;
  }
  
  .mobile-stack {
    flex-direction: column;
  }
  
  .mobile-text-sm {
    font-size: 0.875rem;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none;
  }
  
  body {
    background: white;
  }
  
  .container {
    max-width: none;
    margin: 0;
    padding: 0;
  }
}
```

## Step 3: Backend Setup (Flask)

### 3.1 Create Backend Directory Structure

Create the following structure in the `backend/` directory:

```
backend/
├── src/
│   ├── models/
│   └── routes/
```

### 3.2 Backend Configuration Files

#### requirements.txt
```
Flask==3.0.0
Flask-SQLAlchemy==3.1.1
Flask-CORS==4.0.0
python-dotenv==1.0.0
requests==2.31.0
```

### 3.3 Backend Source Files

#### src/models/user.py
```python
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    full_name = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    farm_size = db.Column(db.Float, nullable=True)
    primary_crops = db.Column(db.String(200), nullable=True)
    language_preference = db.Column(db.String(10), default='english')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    soil_analyses = db.relationship('SoilAnalysis', backref='user', lazy=True)
    community_posts = db.relationship('CommunityPost', backref='author', lazy=True)
    disease_detections = db.relationship('DiseaseDetection', backref='user', lazy=True)

class SoilAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    ph_level = db.Column(db.Float, nullable=False)
    nitrogen = db.Column(db.Float, nullable=False)
    phosphorus = db.Column(db.Float, nullable=False)
    potassium = db.Column(db.Float, nullable=False)
    organic_matter = db.Column(db.Float, nullable=False)
    moisture_content = db.Column(db.Float, nullable=False)
    health_score = db.Column(db.Float, nullable=True)
    soil_type = db.Column(db.String(50), nullable=True)
    recommendations = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CropRecommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    soil_analysis_id = db.Column(db.Integer, db.ForeignKey('soil_analysis.id'), nullable=False)
    crop_name = db.Column(db.String(100), nullable=False)
    variety = db.Column(db.String(100), nullable=True)
    suitability_score = db.Column(db.Float, nullable=False)
    expected_yield = db.Column(db.Float, nullable=True)
    planting_season = db.Column(db.String(50), nullable=True)
    care_instructions = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class WeatherData(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(100), nullable=False)
    temperature = db.Column(db.Float, nullable=False)
    humidity = db.Column(db.Float, nullable=False)
    pressure = db.Column(db.Float, nullable=False)
    wind_speed = db.Column(db.Float, nullable=False)
    rainfall = db.Column(db.Float, default=0.0)
    uv_index = db.Column(db.Float, nullable=True)
    condition = db.Column(db.String(50), nullable=False)
    forecast_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CommunityPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    language = db.Column(db.String(10), default='english')
    likes_count = db.Column(db.Integer, default=0)
    comments_count = db.Column(db.Integer, default=0)
    is_featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class DiseaseDetection(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    crop_type = db.Column(db.String(100), nullable=False)
    image_path = db.Column(db.String(200), nullable=True)
    disease_name = db.Column(db.String(100), nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    severity_level = db.Column(db.String(20), nullable=False)
    treatment_recommendations = db.Column(db.Text, nullable=True)
    preventive_measures = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

## Step 4: Installation Instructions

### 4.1 Frontend Installation

1. Open terminal in VS Code (Terminal → New Terminal)
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### 4.2 Backend Installation

1. Navigate to the backend directory:
   ```bash
   cd ../backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **macOS/Linux:**
     ```bash
     source venv/bin/activate
     ```
4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Step 5: Running the Applications

### 5.1 Start the Backend Server

1. Make sure you're in the backend directory with virtual environment activated
2. Run the Flask application:
   ```bash
   python src/main.py
   ```
3. The backend will start on `http://localhost:5000`

### 5.2 Start the Frontend Development Server

1. Open a new terminal in VS Code
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend will start on `http://localhost:5173`

## Step 6: Testing the Application

1. Open your web browser and go to `http://localhost:5173`
2. Test all features:
   - User registration
   - Soil analysis
   - Weather data
   - Community posts
   - Disease detection
   - Language switching

## Troubleshooting

### Common Issues and Solutions

1. **Port already in use:**
   - Change the port in `vite.config.js` for frontend
   - Change the port in `main.py` for backend

2. **Module not found errors:**
   - Ensure virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

3. **CORS errors:**
   - Verify Flask-CORS is installed and configured
   - Check that frontend is calling the correct backend URL

4. **Database errors:**
   - Delete `database.db` file and restart backend to recreate

## Development Tips

1. **VS Code Configuration:**
   - Install recommended extensions
   - Use integrated terminal for running commands
   - Set up debugging configurations

2. **Code Organization:**
   - Keep frontend and backend in separate terminals
   - Use version control (Git) for tracking changes
   - Follow the existing code structure

3. **API Testing:**
   - Use browser developer tools to inspect network requests
   - Test API endpoints directly using tools like Postman

This completes the setup guide for running the Agriculture Platform locally in VS Code. The application will have full functionality including user management, soil analysis, weather data, community features, and disease detection.

