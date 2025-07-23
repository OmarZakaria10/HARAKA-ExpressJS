pipeline {
    agent any
    
    tools {
        nodejs 'Node' // References the Node.js version configured in Global Tool Configuration
    }
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE = 'omarzakaria10/haraka'
        FRONTEND_REPO = 'https://github.com/OmarZakaria10/HARAKA-ReactJS.git'
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        NODE_ENV = 'production'
    }
    
    stages {
        stage('Cleanup Workspace') {
            steps {
                cleanWs()
            }
        }
        
        stage('Checkout Backend') {
            steps {
                checkout scm
            }
        }
        
        stage('Checkout Frontend') {
            steps {
                dir('frontend-temp') {
                    git branch: 'main', 
                        credentialsId: 'github-credentials', 
                        url: "${FRONTEND_REPO}"
                }
            }
        }
        
        stage('Install Backend Dependencies') {
            steps {
                sh 'npm ci --only=production'
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend-temp') {
                    sh 'npm ci'
                    sh 'CI=false npm run build'
                }
            }
        }
        
        stage('Copy Frontend Build to Backend') {
            steps {
                // Clean existing build directory
                sh 'rm -rf build'
                // Copy new build
                sh 'cp -r frontend-temp/build .'
                // Verify build was copied
                sh 'ls -la build/'
            }
        }
        
        stage('Run Tests') {
            steps {
                // Add your test commands here
                echo 'Running tests...'
                // sh 'npm test'
            }
        }
        
        stage('Docker Environment Check') {
            steps {
                script {
                    echo '🔍 Checking Docker environment...'
                    sh 'docker --version'
                    sh 'docker info'
                    
                    // Test Docker Hub connectivity
                    echo '🔍 Testing Docker Hub connectivity...'
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker logout'
                    
                    echo '✅ Docker environment check passed'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    def imageTag = "${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    def latestTag = "${DOCKER_IMAGE}:latest"
                    
                    // Login to Docker Hub before building to avoid rate limits
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    
                    // Build with better error handling
                    sh "docker build -t ${imageTag} ."
                    sh "docker tag ${imageTag} ${latestTag}"
                    
                    echo "✅ Built image: ${imageTag}"
                }
            }
        }
        
        stage('Push to DockerHub') {
            steps {
                script {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh "docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to production...'
                // Add your deployment commands here
                // For example, update a Kubernetes deployment or restart a service
            }
        }
    }
    
    post {
        always {
            // Cleanup
            sh 'docker logout || true'
            sh 'rm -rf frontend-temp || true'
            
            // Clean up Docker images to save space
            sh """
                docker rmi ${DOCKER_IMAGE}:${BUILD_NUMBER} || true
                docker rmi ${DOCKER_IMAGE}:latest || true
                docker system prune -f || true
            """
        }
        
        success {
            echo 'Pipeline completed successfully!'
            // You can add notifications here (Slack, email, etc.)
        }
        
        failure {
            echo 'Pipeline failed!'
            // You can add failure notifications here
        }
    }
}
