cd ~/portal
if [ ! -d "/vagrant" ]
then
  git pull
fi
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d
cd -