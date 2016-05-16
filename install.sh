#! bin/bash
# Install Script for Honet Networking

echo 'Install Script for Honet Networking'
echo '==================================='

echo 'checking and downloading Nmap'

curl -o nmap.dmg https://nmap.org/dist/nmap-7.12.dmg

sudo hdiutil attach Nmap.dmg

sudo installer -pkg /Volumes/nmap-7.12/nmap-7.12.mpkg -target /

rm -rf nmap.dmg

sudo hdiutil detach /Volumes/nmap-7.12/

echo '==================================='
echo 'Nmap install complete'
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo '==================================='
echo 'installing Node'
echo '==================================='

curl -o node.pkg https://nodejs.org/dist/v4.4.4/node-v4.4.4.pkg 

sudo installer -pkg node.pkg -target /

rm -rf node.pkg


echo '==================================='
echo 'Node install complete'
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo ''
echo '==================================='
echo 'installing MongoDB'
echo '==================================='

curl -O https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.0.12.tgz

tar -zxvf mongodb-osx-x86_64-3.0.12.tgz

sudo mkdir -p /data/db/

sudo mkdir mongodb 

cp -R -n mongodb-osx-x86_64-3.0.12/ mongodb

export PATH=mongodb/bin:$PATH






# # checking to verify that mongo db is installed
# if command -v mongo ; then
# 	echo 'MongoDB already Installed'
# else
# 	echo 'MongoDB not installed'
# fi
# echo ''
# echo '==================================='
# echo ''
# # checking if node is installed
# if command -v node ; then
# 	echo 'node is already installed'
# fi

# # check and verify that node is set to correct version
# if "node --version" == 'v5.1.1' ; then
# 	echo 'downloading and installing node v5.1.1'
# 	nvm install 5.1.1
# 	# nvm use 5.1.1
# 	# echo 'switched versions'
# 	node --version
# else 
# 	echo 'not equal'
# fi

# echo ''
# echo '==================================='
# echo ''
# # checking if node version manager is installed
# if command -v nvm ; then
# 	echo 'NVM installed'
# 	echo 'checking version...'

# else
# 	echo 'running npm install'
# 	npm install -g nvm
# fi

