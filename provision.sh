cd /srv/stats
yarn
if pm2 describe Stats
then
  pm2 restart Stats
else
  pm2 start index.js --name Stats
fi
cd -