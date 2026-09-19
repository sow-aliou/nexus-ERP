# Nexus ERP

Enterprise Resource Planning System (Nexus ERP).

## Architecture

- **Backend**: Spring Boot 3.3 (Java 21) REST API (`/backend`)
- **Frontend**: React (Vite) avec Nginx (`/frontend`)
- **Orchestration**: Docker & Docker Compose

## Lancement avec Docker Compose

Pour compiler et démarrer l'ensemble des conteneurs (Backend + Frontend) :

```bash
docker compose up -d --build
```

### URLs d'accès
- **Frontend (React)**: [http://localhost:3001](http://localhost:3001)
- **Backend API (Spring Boot)**: [http://localhost:8080/api/health](http://localhost:8080/api/health)

## Arrêter les conteneurs

```bash
docker compose down
```
