cd ~/portal
source env.sh
sudo -E docker-compose build -e PROD_HOST
sudo -E docker-compose up -d
cd -