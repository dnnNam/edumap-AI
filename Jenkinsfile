pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    stages {
        stage('1. Kéo Code từ GitHub') {
            steps {
                checkout scm
            }
        }

        stage('2. Cài đặt thư viện (npm install)') {
            steps {
                echo 'Đang cài đặt node_modules...'
                sh 'npm install'
            }
        }

        stage('3. Chạy Kiểm thử (Unit Test)') {
            steps {
                echo 'Đang chạy Jest test...'
                // Lệnh test logic, nếu fail luồng sẽ tự dừng ngay lập tức
                sh 'npm run test'
            }
        }

        stage('4. Build Production (Vite)') {
            steps {
                echo 'Đang build mã nguồn ra thư mục dist...'
                withCredentials([file(credentialsId: 'frontend-env-file', variable: 'ENV_FILE')]) {
                    sh 'cp $ENV_FILE .env'
                }
                sh 'npm run build'
            }
        }

        stage('5. Deploy ra Nginx (Phát hành)') {
            steps {
                echo 'Đang bắn code ra VPS qua cổng SSH...'
                sh 'ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} "rm -rf /home/nam/edumap_web/*"'
                sh 'scp -o StrictHostKeyChecking=no -r dist/* ${VPS_USER}@${VPS_IP}:/home/nam/edumap_web/'
            }
        }
    }
}