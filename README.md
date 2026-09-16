# Hospital Management System - CRUD Web Application

## Technology Stack
- Frontend: React + Vite + CSS
- Backend: Django + Django REST Framework
- Database: SQLite
- API Testing: Postman (optional)

## Features
- Add patient
- View/search/filter patients
- Edit patient details
- Delete patient details
- Client-side and server-side validation
- REST API
- SQLite database
- Responsive UI

## Project Structure
hospital_management_system/
├── backend/
└── frontend/

## Backend Setup
```bash
cd backend
python -m venv venv
```

### Windows
```bash
venv\Scripts\activate
```

### Install packages
```bash
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

Backend runs at:
http://127.0.0.1:8000

API:
http://127.0.0.1:8000/api/patients/

## Frontend Setup
Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally:
http://localhost:5173

## CRUD API Endpoints
| Operation | Method | Endpoint |
|---|---|---|
| Create | POST | /api/patients/ |
| Read All | GET | /api/patients/ |
| Read One | GET | /api/patients/{id}/ |
| Update | PUT/PATCH | /api/patients/{id}/ |
| Delete | DELETE | /api/patients/{id}/ |

## Patient Fields
- Full Name
- Age
- Gender
- Email
- Phone
- Blood Group
- Disease/Problem
- Admission Date

## Testing
Use the frontend or Postman to test valid and invalid Create, Read, Update and Delete requests.
