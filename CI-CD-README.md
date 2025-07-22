# CI/CD Setup for HARAKA Project

This repository contains the CI/CD configuration for the HARAKA Vehicle & License Management System.

## Architecture

- **Frontend**: React.js application ([HARAKA-ReactJS](https://github.com/OmarZakaria10/HARAKA-ReactJS))
- **Backend**: Express.js API (this repository)
- **Database**: PostgreSQL
- **Container**: Docker
- **CI/CD**: Jenkins & GitHub Actions

## Pipeline Options

### Option 1: Jenkins Pipeline (Jenkinsfile)

The Jenkins pipeline automatically:
1. Checks out both frontend and backend repositories
2. Builds the React frontend
3. Copies the built frontend to the backend's `build` directory
4. Builds the Docker image with the full application
5. Pushes to DockerHub
6. Deploys to production (configurable)

#### Prerequisites

1. **Jenkins Setup**:
   ```bash
   # Install Node.js plugin
   # Configure Global Tool Configuration -> NodeJS -> Add Node.js (name: 'Node')
   ```

2. **Credentials Setup**:
   - `dockerhub-credentials`: DockerHub username/password
   - `github-credentials`: GitHub token for private repositories

3. **Jenkins Pipeline Job**:
   - Create new Pipeline job
   - Point to this repository
   - Select "Pipeline script from SCM"
   - Script Path: `Jenkinsfile`

### Option 2: GitHub Actions (.github/workflows/ci-cd.yml)

#### Prerequisites

1. **Repository Secrets**:
   ```
   DOCKERHUB_USERNAME=your_dockerhub_username
   DOCKERHUB_TOKEN=your_dockerhub_token
   ```

2. **Frontend Repository Access**:
   - Ensure the frontend repository is accessible
   - For private repos, configure appropriate tokens

## Repository Structure

```
HARAKA-ExpressJS/
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions workflow
├── Jenkinsfile                 # Jenkins pipeline
├── dockerfile                  # Optimized Docker configuration
├── docker-compose.yml          # Local development setup
├── healthcheck.js              # Docker health check
├── package.json
├── app.js
└── ... (other backend files)
```

## Deployment Options

### Option A: Same Repository (Current Setup)

**Pros:**
- ✅ Single repository to manage
- ✅ Simpler setup for small teams
- ✅ Direct integration with backend code

**Cons:**
- ❌ Couples CI/CD with application code
- ❌ Less flexible for scaling
- ❌ Harder to manage multiple environments

### Option B: Separate CI/CD Repository (Recommended for scaling)

Create a new repository `HARAKA-CI-CD`:

```
HARAKA-CI-CD/
├── Jenkinsfile
├── docker-compose.yml
├── kubernetes/
│   ├── namespace.yml
│   ├── deployment.yml
│   └── service.yml
├── scripts/
│   ├── build.sh
│   ├── deploy.sh
│   └── rollback.sh
└── environments/
    ├── dev/
    ├── staging/
    └── production/
```

## Local Development

### Using Docker Compose

```bash
# Clone the repositories
git clone https://github.com/OmarZakaria10/HARAKA-ExpressJS.git
git clone https://github.com/OmarZakaria10/HARAKA-ReactJS.git

# Build frontend
cd HARAKA-ReactJS
npm install
npm run build

# Copy to backend
cp -r build ../HARAKA-ExpressJS/

# Start services
cd ../HARAKA-ExpressJS
docker-compose up -d
```

### Manual Setup

```bash
# Backend
cd HARAKA-ExpressJS
npm install
npm run dev

# Frontend (in another terminal)
cd HARAKA-ReactJS
npm install
npm start
```

## Environment Variables

Create `.env` file in the backend repository:

```env
NODE_ENV=development
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=haraka_db
DB_USER=haraka_user
DB_PASSWORD=haraka_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
```

## Docker Configuration

### Build Image Locally

```bash
# Build the frontend first
cd ../HARAKA-ReactJS
npm run build
cp -r build ../HARAKA-ExpressJS/

# Build Docker image
cd ../HARAKA-ExpressJS
docker build -t haraka:local .
```

### Run Container

```bash
docker run -d \
  --name haraka-app \
  -p 4000:4000 \
  -e NODE_ENV=production \
  haraka:local
```

## Production Deployment

### Using Docker

```bash
# Pull latest image
docker pull omarzakaria10/haraka:latest

# Run with environment variables
docker run -d \
  --name haraka-production \
  -p 4000:4000 \
  --env-file .env.production \
  omarzakaria10/haraka:latest
```

### Using Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f kubernetes/namespace.yml
kubectl apply -f kubernetes/deployment.yml
kubectl apply -f kubernetes/service.yml
```

## Monitoring and Logs

### Health Check

The application includes a health check endpoint:
- URL: `http://localhost:4000/`
- Docker health check runs every 30 seconds

### Logs

```bash
# Docker logs
docker logs haraka-app

# Docker Compose logs
docker-compose logs -f backend
```

## Security Considerations

1. **Secrets Management**:
   - Use Jenkins credentials store
   - Use GitHub repository secrets
   - Never commit secrets to code

2. **Docker Security**:
   - Non-root user in container
   - Minimal base image (Alpine)
   - Regular security updates

3. **Network Security**:
   - Container networking
   - Reverse proxy configuration
   - SSL/TLS termination

## Troubleshooting

### Common Issues

1. **Frontend build not copied**:
   ```bash
   # Verify build directory exists
   ls -la build/
   ```

2. **Docker image too large**:
   ```bash
   # Use multi-stage builds
   # Clean npm cache
   # Use .dockerignore
   ```

3. **Permission issues**:
   ```bash
   # Check file ownership
   # Ensure proper user permissions in Docker
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test locally with Docker Compose
5. Submit a pull request

## Support

For issues and questions:
- Create an issue in this repository
- Check the documentation
- Review the logs for error details
