#!/bin/bash

# HARAKA Deployment Script
# This script automates the deployment process

set -e  # Exit on any error

# Configuration
FRONTEND_REPO="https://github.com/OmarZakaria10/HARAKA-ReactJS.git"
DOCKER_IMAGE="omarzakaria10/haraka"
FRONTEND_DIR="frontend-temp"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if running with proper permissions
check_permissions() {
    if [[ $EUID -eq 0 ]]; then
        warning "Running as root. Consider using a non-root user."
    fi
}

# Check required tools
check_requirements() {
    log "Checking requirements..."
    
    command -v node >/dev/null 2>&1 || error "Node.js is required but not installed."
    command -v npm >/dev/null 2>&1 || error "npm is required but not installed."
    command -v git >/dev/null 2>&1 || error "git is required but not installed."
    command -v docker >/dev/null 2>&1 || error "Docker is required but not installed."
    
    success "All requirements met"
}

# Clean previous builds
cleanup() {
    log "Cleaning up previous builds..."
    rm -rf $FRONTEND_DIR
    rm -rf build
    docker system prune -f >/dev/null 2>&1 || true
}

# Clone and build frontend
build_frontend() {
    log "Cloning frontend repository..."
    git clone $FRONTEND_REPO $FRONTEND_DIR
    
    log "Installing frontend dependencies..."
    cd $FRONTEND_DIR
    npm ci
    
    log "Building frontend..."
    CI=false npm run build
    cd ..
    
    success "Frontend built successfully"
}

# Copy frontend build to backend
copy_frontend() {
    log "Copying frontend build to backend..."
    cp -r $FRONTEND_DIR/build .
    
    # Verify build was copied
    if [ ! -d "build" ]; then
        error "Frontend build not found after copying"
    fi
    
    success "Frontend build copied successfully"
}

# Build Docker image
build_docker() {
    local tag=${1:-latest}
    
    log "Building Docker image with tag: $tag..."
    docker build -t $DOCKER_IMAGE:$tag .
    
    success "Docker image built successfully"
}

# Push to DockerHub
push_docker() {
    local tag=${1:-latest}
    
    log "Pushing Docker image to DockerHub..."
    
    # Check if logged in to DockerHub
    if ! docker info | grep -q "Username"; then
        warning "Not logged in to DockerHub. Please run: docker login"
        return 1
    fi
    
    docker push $DOCKER_IMAGE:$tag
    success "Docker image pushed successfully"
}

# Deploy locally
deploy_local() {
    log "Starting local deployment with Docker Compose..."
    docker-compose down --remove-orphans
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for services to start..."
    sleep 10
    
    # Check if backend is running
    if curl -f http://localhost:4000/ >/dev/null 2>&1; then
        success "Local deployment successful! Backend is running on http://localhost:4000"
    else
        error "Local deployment failed. Check logs with: docker-compose logs"
    fi
}

# Show usage
usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  build              Build the full application (frontend + backend)"
    echo "  docker [TAG]       Build Docker image (default tag: latest)"
    echo "  push [TAG]         Push Docker image to DockerHub"
    echo "  deploy-local       Deploy locally using Docker Compose"
    echo "  full [TAG]         Complete build and push cycle"
    echo "  help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build                    # Build frontend and backend"
    echo "  $0 docker v1.0.0           # Build Docker image with tag v1.0.0"
    echo "  $0 push latest              # Push latest image to DockerHub"
    echo "  $0 full v1.0.0             # Complete cycle with version tag"
    echo "  $0 deploy-local             # Deploy locally for testing"
}

# Main script logic
main() {
    check_permissions
    check_requirements
    
    case "${1:-help}" in
        "build")
            cleanup
            build_frontend
            copy_frontend
            ;;
        "docker")
            TAG=${2:-latest}
            build_docker $TAG
            ;;
        "push")
            TAG=${2:-latest}
            push_docker $TAG
            ;;
        "deploy-local")
            deploy_local
            ;;
        "full")
            TAG=${2:-latest}
            cleanup
            build_frontend
            copy_frontend
            build_docker $TAG
            push_docker $TAG
            ;;
        "help"|"--help"|"-h")
            usage
            ;;
        *)
            error "Unknown command: $1. Use '$0 help' for usage information."
            ;;
    esac
}

# Run main function with all arguments
main "$@"
