cd ~/portal
if [ ! -d "/vagrant" ]
then
  git pull
  export PROD_HOST=portal.kognise.dev
fi
sudo docker-compose build -e PROD_HOST
sudo docker-compose down
sudo docker-compose up -d
cd -