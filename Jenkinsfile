static final String GIT_URL = 'https://github.com/jzade/tsa-api.git'

def IMAGE_NAME = "tsa-api:1.0.${env.BUILD_NUMBER}"

pipeline {
    agent { label 't4dev' }
    options {
        buildDiscarder(logRotator(numToKeepStr: '10', artifactNumToKeepStr: '10'))
    }
    environment {
        PATH = '/usr/local/bin:/usr/bin:/usr/local/sbin:/usr/sbin:/home/centos/.local/bin:/home/centos/bin'
    }
    stages {
        stage('npm install') {
            agent {
                docker {
                    image 'node:12.16.3'
                }
            }
            steps {
                sh 'npm install'
                stash name: "node-modules", includes: "node_modules/**/*"
            }
        }
        stage('Create Image') {
            steps {
                unstash "node-modules"
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }
        stage('Stop existing') {
            steps {
                sh 'docker stop tsa-api || true'
                sh 'docker rm tsa-api || true'
            }
        }
        stage('Start container') {
            steps {
                sh 'API KEY'
                sh "env"
                sh "docker run --name tsa-api --restart=always -e TSA_ENV_PORT=3000 -e TSA_DEV_ENV=production -e TSA_API_KEY=${env.TSA_API_KEY} -p 3000:3000 -d ${IMAGE_NAME}"
            }
        }
        stage('Cleanup') {
            steps {
                sh 'echo "Should remove old images"'
            }
        }
    }
}

