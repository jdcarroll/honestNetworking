#!/bin/bash
# Install Script for Honet Networking

echo 'Install Script for Honet Networking'
echo '==================================='

echo ''
echo ''
echo ''
echo ''
echo '==================================='
echo 'Checking and downloading Nmap'
command -v nmap >/dev/null 2>&1 || {
	# download nmap from there website
	curl -o nmap.dmg https://nmap.org/dist/nmap-7.12.dmg
	# mount the nmap disk
	sudo hdiutil attach Nmap.dmg
	# run the nmap installer and set the install location to /
	sudo installer -pkg /Volumes/nmap-7.12/nmap-7.12.mpkg -target /
	# remove the downloaded installer file
	rm -rf nmap.dmg
	# unmount install disk
	sudo hdiutil detach /Volumes/nmap-7.12/
	echo '==================================='
	echo 'Nmap install complete'
}
echo ''
echo ''
echo ''
echo ''
echo '==================================='
echo 'installing airport symlink'
echo '==================================='
# create symlink to enable airport module 
sudo ln -s /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/local/bin/airport

echo '==================================='
echo 'symlink created'
echo ''
echo ''
echo ''
echo ''
echo '==================================='
echo 'installing Node Version Manager'
echo '==================================='

command -v nvm >/dev/null 2>&1 || {
	
	echo 'installing node version manager'

	curl -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
	echo '==================================='
	echo 'Node install complete'
}

echo ''
nvm use system

nvm install 5.1.1

nvm use 5.1.1


echo ''
echo ''
echo ''
echo ''
echo '==================================='
echo 'installing MongoDB'
echo '==================================='

command -v mongo >/dev/null 2>&1 || {
	curl -O https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.0.12.tgz

	tar -zxvf mongodb-osx-x86_64-3.0.12.tgz

	rm -rf mongodb-osx-x86_64-3.0.12.tgz

	sudo mkdir -p /data/db/

	sudo mkdir mongodb 

	sudo cp -R -n mongodb-osx-x86_64-3.0.12/ mongodb

	rm -rf mongodb-osx-x86_64-3.0.12

	export PATH=mongodb/bin:$PATH

	echo '==================================='
	echo 'MongoDB install complete'
}


echo ''
echo ''
echo ''
echo ''
echo '==================================='
echo 'starting mongodb'
echo '==================================='

mongod &

echo ''
echo 'Mongodb Started'
echo ''
echo ''
echo ''
echo ''
echo '==================================='
echo 'installing Global NPM Modules'
echo '==================================='

npm install -g gulp
npm install -g bower

echo ''
echo ''
echo ''
echo ''
echo '==================================='
echo 'installing NPM Modules'
echo '==================================='

npm install

echo ''
echo ''
echo ''
echo ''
echo '==================================='
echo 'installing bower components'
echo '==================================='

bower install

echo ''
echo ''
echo ''
echo ''
echo '==================================='
echo 'launching app'
echo '==================================='

DEBUG=true gulp &

open "http://localhost:4000"

