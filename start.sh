cd ~/portal
if [ ! -d "/vagrant" ]
then
  export PROD_HOST=portal.kognise.dev
fi
sudo docker-compose build -e PROD_HOST
sudo docker-compose up -d
cd -