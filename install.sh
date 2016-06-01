#!/bin/bash
# Install Script for Honet Networking
rm -rf log
mkdir log
echo 'Install Script for Honet Networking'
echo '==================================='
read -r -p "Do you want DEBUG Mode on? [y/N] " errorMode

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

if [ ! -f /usr/local/bin/airport ]; then
    echo '==================================='
	echo 'installing airport symlink'
	echo '==================================='
	# create symlink to enable airport module 
	sudo ln -s /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/local/bin/airport

	echo '==================================='
	echo 'symlink created'
fi

command -v nvm >/dev/null 2>&1 || {

	echo $2
	echo $1
	
	echo '==================================='
	echo 'installing Node Version Manager'
	echo '==================================='

	curl -o- https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 1>>log/nvmInstall.log
	wait 
	echo '' & nvm install 5.1.1 & nvm use 5.1.1 2>>log/nvmInstall.log
}
	echo '==================================='
	echo 'install node version 5.1.1'
	echo '===================================' 
	nvm install 5.1.1 2>>log/nvmInstall.log

	nvm use 5.1.1 2>>log/nvmInstall.log || {
	echo 'there is something wrong with your node installation'
	echo '==================================='
	echo 'solution'
	echo 'use NVM Node Version Manager'
	echo 'https://github.com/creationix/nvm'
	echo 'you need node version 5.1.1 for this project'
	echo '==================================='
	echo 'Node install complete'
}

command -v mongo >/dev/null 2>&1 || {
	echo '==================================='
	echo 'installing MongoDB'
	echo '==================================='
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
echo '==================================='
echo 'starting mongodb'
echo '==================================='

sudo mongod 1>>log/mongodb.log wait & 

# check and verify that node-gyp is installed to supoort socket watcher
command -v node-gyp >/dev/null 2>&1 || {
	echo '==================================='
	echo 'installing Global Node-gyp'
	echo '==================================='
	npm install -g node-gyp
}
# Check and verifying that gulp is installed globally
command -v gulp >/dev/null 2>&1 || {
	echo '==================================='
	echo 'installing Global Gulp'
	echo '==================================='
	npm install -g gulp 1>log/gulpInstall.log
}
# Check and verifying that bower is installed globally
command -v bower >/dev/null 2>&1 || {
	echo '==================================='
	echo 'installing Global Bower'
	echo '==================================='
	npm install -g bower 1>log/bowerGlobalInstall.log
}
# Check and verifying that node_modules are installed
if [ ! -d "node_modules" ]; then
  	echo '==================================='
	echo 'installing NPM Modules'
	echo '==================================='

	npm install 1>log/npmInstall.log
	npm install pcap2 1>>log/npmInstall.log

fi
# Check and verifying that bower_components are installed 
if [ ! -d "bower_components" ]; then
	echo '==================================='
	echo 'installing bower components'
	echo '==================================='

	sudo bower install --allow-root 1>log/bower_components.log

fi
# launching app
echo '==================================='
echo 'launching app'
echo '==================================='

if [[ $errorMode =~ ^([yY][eE][sS]|[yY])$ ]]
# launching in error mode
then
	echo '==================================='
	echo 'DEBUG Mode on'
	echo '==================================='

	open "http://localhost:4000"

	sudo DEBUG=true gulp
else
# launching in normal mode
	echo '==================================='
	echo 'DEBUG Mode off'
	echo '==================================='

	open "http://localhost:4000" 

	sudo gulp 
fi





