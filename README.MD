# 🧱 My Full Stack Django Project

This is a full stack web application powered by:
- 🐍 **Django** (Backend)
- ⚛️ **Frontend** (React/Vite/etc.)
- 🐘 **PostgreSQL** (Database)

All services are containerized using Docker.

---

## 🚀 Project Structure

```
project-root/
│
├── backend/        # Django project
├── frontend/       # React or other frontend
├── docker-compose.yml
└── README.md
```

---

## 🐳 How to Run the Project

Make sure Docker and Docker Compose are installed.

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/yourproject.git
cd yourproject
```

### 2. Start all services

```bash
docker-compose up --build
```

- The **backend** (Django) will be available at: `http://localhost:8000`
- The **frontend** will be available at: `http://localhost:3000`
- The **database** (PostgreSQL) runs internally and is used by Django

---

## 🧪 Useful Commands

### Run migrations

```bash
docker-compose exec backend python manage.py migrate
```

### Create a superuser

```bash
docker-compose exec backend python manage.py createsuperuser
```

### Access Django shell

```bash
docker-compose exec backend python manage.py shell
```

---

## ⚙️ Environment Variables

Define them in a `.env` file (not committed to git):

### Example `.env` for Django

```env
POSTGRES_DB=myprojectdb
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
DEBUG=True
SECRET_KEY=your-secret-key
```

---

## 📝 Notes

- The backend waits for the database to be ready before starting.
- The frontend talks to the backend through the exposed API.
- Be sure to configure `ALLOWED_HOSTS` and CORS as needed in production.

---

## 📦 Dependencies

- Python 3.x
- Node.js (for frontend)
- PostgreSQL
- Docker + Compose

---
