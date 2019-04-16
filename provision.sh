sudo apt-get update

curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

if [ -d "/vagrant" ]
then
  ln -s /vagrant /home/vagrant/portal
  export PROFILE_USER="vagrant"
else
  export PROFILE_USER="$USER"
  git clone https://github.com/kognise/portal ~/portal
fi

cat > /home/$PROFILE_USER/.bash_aliases <<- EOM
alias start="bash ~/portal/start.sh"
alias restart="bash ~/portal/restart.sh"
echo "Run start to start Project Portal / restart to update it."
EOM