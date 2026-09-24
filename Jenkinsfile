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
                sh 'npm run build'
            }
        }

      stage('5. Deploy ra Nginx (Phát hành)') {
            steps {
                echo 'Đang copy code mới lên thư mục web...'
                sh 'rm -rf /home/nam/edumap_web/*'
                sh 'cp -r dist/* /home/nam/edumap_web/'
            }
        }
    }
}