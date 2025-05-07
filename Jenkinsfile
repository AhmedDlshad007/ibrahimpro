pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKER_IMAGE = 'ahmed181/ibrahimpro'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                // Add build commands if needed
                // For a Node.js app: sh 'npm install'
                echo 'Build stage completed'
            }
        }
        
        stage('Test') {
            steps {
                // Add test commands if available
                // For a Node.js app: sh 'npm test'
                echo 'Tests completed'
            }
        }
        
        stage('Docker Build') {
            steps {
                script {
                    bat "docker build -t ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ."
                    bat "docker tag ${DOCKER_IMAGE}:${env.BUILD_NUMBER} ${DOCKER_IMAGE}:latest"
                }
            }
        }
        
        stage('Docker Login') {
            steps {
                bat "docker login -u %DOCKERHUB_CREDENTIALS_USR% -p %DOCKERHUB_CREDENTIALS_PSW%"
            }
        }
        
        stage('Docker Push') {
            steps {
                bat "docker push ${DOCKER_IMAGE}:${env.BUILD_NUMBER}"
                bat "docker push ${DOCKER_IMAGE}:latest"
            }
        }
    }
    
    post {
        always {
            bat "docker logout"
        }
    }
}