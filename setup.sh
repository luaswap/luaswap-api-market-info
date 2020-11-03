# INSTALL NODEJS
sudo apt update
sudo apt install nodejs
sudo apt install npm

npm install -g npm@latest

# FIX NODE-GYP
sudo apt-get update && \
sudo apt-get install build-essential software-properties-common -y;

sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y && \
sudo apt-get update && \
sudo apt-get install gcc-snapshot -y && \
sudo apt-get update && \
sudo apt-get install gcc-6 g++-6 -y && \
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-6 60 --slave /usr/bin/g++ g++ /usr/bin/g++-6 && \
sudo apt-get install gcc-4.8 g++-4.8 -y && \
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-4.8 60 --slave /usr/bin/g++ g++ /usr/bin/g++-4.8;

sudo apt update
sudo apt upgrade
sudo apt install python2.7 python-pip

npm install -g node-gyp

# INSTALL PM2
sudo npm install -g pm2

# SETUP PROJECT
git clone https://github.com/tunght91/change-backend-app.git
cd change-backend-app
cp env.sample .env
npm i