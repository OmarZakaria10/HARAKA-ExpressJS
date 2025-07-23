pipeline {
    agent any
    
    tools {
        nodejs 'Node'
    }
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE = 'omarzakaria10/haraka'
        FRONTEND_REPO = 'https://github.com/OmarZakaria10/HARAKA-ReactJS.git'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        NODE_ENV = 'production'
        // Enable BuildKit for faster Docker builds
        DOCKER_BUILDKIT = '1'
    }
    
    options {
        // Keep builds for history but limit to save space
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Timeout the build after 30 minutes
        timeout(time: 30, unit: 'MINUTES')
        // Skip default checkout - we'll do it explicitly
        skipDefaultCheckout(true)
    }
    
    stages {
        stage('Checkout & Setup') {
            parallel {
                stage('Checkout Backend') {
                    steps {
                        // Clean workspace and checkout
                        cleanWs()
                        checkout scm
                    }
                }
                stage('Checkout Frontend') {
                    steps {
                        dir('frontend-temp') {
                            git branch: 'main', 
                                url: "${FRONTEND_REPO}"
                        }
                    }
                }
            }
        }
        
        stage('Build & Prepare') {
            parallel {
                stage('Install Backend Dependencies') {
                    steps {
                        // Use npm ci with cache for faster installs
                        sh '''
                            npm ci --only=production --cache .npm-cache --prefer-offline
                        '''
                    }
                }
                stage('Build Frontend') {
                    steps {
                        dir('frontend-temp') {
                            sh '''
                                # Use npm cache and skip integrity checks for speed
                                npm ci --cache ../.npm-cache --prefer-offline
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
                    // Copy frontend build efficiently
                    sh '''
                        rm -rf build
                        cp -r frontend-temp/build .
                        echo "✅ Frontend build copied ($(du -sh build | cut -f1))"
                    '''
                    
                    // Quick verification
                    if (!fileExists('build/index.html')) {
                        error('Frontend build verification failed!')
                    }
                }
            }
        }
        
        stage('Build & Push Docker Image') {
            when {
                anyOf {
                    branch 'main'
                    changeRequest()
                }
            }
            steps {
                script {
                    def imageTag = "${DOCKER_IMAGE}:${IMAGE_TAG}"
                    def latestTag = "${DOCKER_IMAGE}:latest"
                    
                    // Single Docker login for entire build process
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', 
                                                     usernameVariable: 'DOCKER_USER', 
                                                     passwordVariable: 'DOCKER_PASS')]) {
                        sh '''
                            echo "🔑 Logging into DockerHub..."
                            echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                            
                            echo "🔨 Building Docker image with BuildKit..."
                            docker build --progress=plain -t ${DOCKER_IMAGE}:${IMAGE_TAG} .
                            docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest
                            
                            echo "📤 Pushing images to DockerHub..."
                            docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                            docker push ${DOCKER_IMAGE}:latest
                            
                            echo "✅ Images pushed successfully"
                        '''
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo "🚀 Deploying to production environment..."
                // Add your deployment commands here
                // sh './deploy.sh production'
            }
        }
    }
    
    post {
        always {
            script {
                // Cleanup with minimal impact
                sh '''
                    # Only logout if logged in
                    docker logout || true
                    
                    # Clean only current build images to save space
                    docker rmi ${DOCKER_IMAGE}:${IMAGE_TAG} || true
                    
                    # Remove frontend temp directory
                    rm -rf frontend-temp || true
                    
                    # Light cleanup - only remove dangling images
                    docker image prune -f || true
                '''
            }
        }
        
        success {
            echo '✅ Pipeline completed successfully!'
            // Add notifications here if needed
            // slackSend(channel: '#deployments', message: "✅ HARAKA ${IMAGE_TAG} deployed successfully!")
        }
        
        failure {
            echo '❌ Pipeline failed!'
            // Add failure notifications here
            // slackSend(channel: '#deployments', message: "❌ HARAKA ${IMAGE_TAG} build failed!")
        }
        
        unstable {
            echo '⚠️ Pipeline completed with warnings'
        }
    }
}
