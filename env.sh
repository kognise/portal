if [ ! -d "/vagrant" ]
then
  export PROD_HOST=portal.kognise.dev
else
  export PROD_HOST=
fi