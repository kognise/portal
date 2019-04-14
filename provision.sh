cd /srv/stats
yarn
if pm2 describe Stats
then
  pm2 restart Stats
else
  pm2 start index.js --name Stats
fi
cd -

cd /srv/heart
yarn
if pm2 describe Heart
then
  pm2 restart Heart
else
  pm2 start index.js --name Heart
fi
cd -