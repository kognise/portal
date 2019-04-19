if [ ! -d "/vagrant" ]
then
  export PROD_HOST=portal.kognise.dev
else
  export PROD_HOST=
fi
export MONGO_PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)