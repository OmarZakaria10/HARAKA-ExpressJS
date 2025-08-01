// ===================================================================
// HARAKA CI/CD Pipeline - Optimized for Smaller Docker Images
// ===================================================================
// This pipeline builds a full-stack app (Express.js + React) 
// and deploys it as a Docker container to DockerHub
// 
// Requirements:
// - Jenkins with Docker capability
// - NodeJS tool configured in Jenkins
// - DockerHub credentials stored as 'dockerhub-credentials'
// ===================================================================

pipeline {
    agent any
    
    // Tools required for the build - works on both local and cloud Jenkins
    tools {
        nodejs 'Node' // Ensure this matches your Jenkins NodeJS tool name
    }
    
    // Environment variables - easily configurable for different environments
    environment {
        // Docker configuration
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE = 'omarzakaria10/haraka'
        
        // Application configuration
        NODE_ENV = 'production'
        FRONTEND_REPO = 'https://github.com/OmarZakaria10/HARAKA-ReactJS.git'
        BACKEND_REPO = 'https://github.com/OmarZakaria10/HARAKA-ExpressJS.git'

        // Build optimization - faster Docker builds
        DOCKER_BUILDKIT = '1'
    }
    
    // Pipeline options - suitable for local Jenkins with limited resources
    options {
        // Prevent workspace pollution on local machine
        skipDefaultCheckout(true)
        
        // Prevent hanging builds - important for local setups
        timeout(time: 20, unit: 'MINUTES')
        
        // Keep only recent builds to save disk space
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }
    
    // Build triggers - only for main branch changes
    triggers {
        // Poll SCM every 15 minutes for changes (can be disabled for manual-only builds)
        pollSCM('H/15 * * * *')
    }
    
    stages {
        stage('Branch Check & Setup') {
            steps {
                script {
                    // Clean workspace first
                    cleanWs()
                }
                
                // Checkout both repositories into separate directories
                dir('backend-temp') {
                    git branch: 'main',
                        url: "${BACKEND_REPO}"
                }
                dir('frontend-temp') {
                    git branch: 'main',
                        url: "${FRONTEND_REPO}"
                }
            }
        }
        
        stage('Build & Prepare') {
            parallel {
                stage('Install Backend Dependencies') {
                    steps {
                        dir('backend-temp') {
                            // Use npm ci with cache for faster installs
                            sh '''
                                npm ci --only=production 
                            '''
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend-temp') {
                            sh '''
                                # Use npm cache and skip integrity checks for speed
                                npm ci 
                                CI=false npm run build
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Prepare Application') {
            steps {
                script {
                    dir('backend-temp') {
                        sh '''
                            set -e
                            echo "Preparing backend directory..."
                            rm -rf build
                            # Copy built frontend from sibling directory
                            cp -R ../frontend-temp/build .
                            echo "✅ Frontend build copied ($(du -sh build | cut -f1))"
                        '''
                        
                        // Quick verification
                        if (!fileExists('build/index.html')) {
                            error('Frontend build verification failed!')
                        }
                        echo 'Frontend build verification passed.'
                    }
                }
            }
        }
        
        stage('Build & Push Docker Image') {
            steps {
                script {
                    dir('backend-temp') {
                        // Only using latest tag for simpler deployment
                        def imageTag = "${DOCKER_IMAGE}:latest"
                        
                        // Single Docker login for entire build process
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', 
                                                         usernameVariable: 'DOCKER_USER', 
                                                         passwordVariable: 'DOCKER_PASS')]) {
                            sh '''
                                set -e
                                echo "🔑 Logging into DockerHub..."
                                echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                                
                                echo "🔨 Building Docker image with BuildKit..."
                                docker build --progress=plain -t ${DOCKER_IMAGE}:latest .
                                
                                echo "📤 Pushing image to DockerHub..."
                                docker push ${DOCKER_IMAGE}:latest
                                
                                echo "✅ Image pushed successfully"
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                // Only deploy on main branch builds (manual or automatic)
                anyOf {
                    branch 'main'
                    // Allow manual builds to deploy regardless of branch
                    triggeredBy 'UserIdCause'
                }
            }
            steps {
                echo "🚀 Deploying to production environment..."
                // Add your deployment commands here when ready
                // Example: sh './deploy.sh production'
                // Example: sh 'docker-compose -f docker-compose.prod.yml up -d'
            }
        }
    }
    
    // Post-build actions - optimized for local Jenkins resource management
    post {
        always {
            script {
                // Lightweight cleanup to prevent local machine from running out of space
                sh '''
                    # Safely logout from DockerHub
                    docker logout || true
                    
                    # Clean up temporary directories
                    rm -rf frontend-temp || true
                    rm -rf backend-temp || true
                    
                    # Remove unused Docker images (but be gentle for local setups)
                    docker image prune -f || true
                '''
            }
        }
        
        success {
            echo '✅ Pipeline completed successfully!'
            // Future: Add notifications when moving to cloud
            // slackSend(channel: '#deployments', message: "✅ HARAKA latest deployed successfully!")
        }
        
        failure {
            echo '❌ Pipeline failed! Check the logs above for details.'
            // Future: Add failure notifications when moving to cloud
            // slackSend(channel: '#deployments', message: "❌ HARAKA build failed!")
        }
        
        unstable {
            echo '⚠️ Pipeline completed with warnings - check the build logs'
        }
    }
}