cd ~/portal
if [ ! -d "/vagrant" ]
then
  git pull
fi
bash ./restart.actual.sh
cd -