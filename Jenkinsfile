pipeline {
    agent any
    
    environment {
        // 替换为你的ACR信息
        ACR_REGISTRY = 'crpi-98ymlx0yqe646pye.cn-guangzhou.personal.cr.aliyuncs.com' // 根据你的ACR地域修改
        ACR_NAMESPACE = 'myq-space' // 你的ACR命名空间
        ACR_REPO = 'langrissar-jsq' // 你的镜像仓库名称
        ACR_CREDENTIALS = 'aliyun-acr-cred' // 你在Jenkins中配置的凭据ID
    }
    
    stages {
        stage('Checkout') {
            steps {
                 git(
                    url: 'https://github.com/your-username/your-repo.git',
                    credentialsId: 'github-token',
                    branch: 'main'
                )
            }
        }
        
        stage('Build') {
            steps {
                script {
                    docker.withRegistry("https://${ACR_REGISTRY}", ACR_CREDENTIALS) {
                        def customImage = docker.build("${ACR_NAMESPACE}/${ACR_REPO}:${env.BUILD_ID}")
                        
                        // 推送镜像到ACR
                        customImage.push()
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    // SSH到服务器并部署
                    sshagent(['aliyun-ecs-ssh-credential']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no root@47.113.147.241 << EOF
                            docker pull ${ACR_REGISTRY}/${ACR_NAMESPACE}/${ACR_REPO}:${env.BUILD_ID}
                            docker stop vue-app || true
                            docker rm vue-app || true
                            docker run -d -p 80:80 --name vue-app ${ACR_REGISTRY}/${ACR_NAMESPACE}/${ACR_REPO}:${env.BUILD_ID}
                            EOF
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}