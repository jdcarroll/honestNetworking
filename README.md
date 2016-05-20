[![Code Climate](https://codeclimate.com/github/jdcarroll/honestNetworking/badges/gpa.svg)](https://codeclimate.com/github/jdcarroll/honestNetworking)
# honestNetworking
### The complete automated network monitor for local network

#### Disclaimer

This App is a network monitoring tool doing tasks like wifi and device discovery. If used in the wrong way this tool is illegal and you use at your own risk.  I take now legal responsibilty for misuse of this app.

### System Requirements

As of right now this application will only run on MAC OSX.  I am working on the linux build out but currently there a OS dependant features of this app that require the MAC OSX airport utility.

Honest Networking requires node version 5.1.1 or higher to successfull do packet anyalis as it relies on [Pcap2](https://github.com/andygreenegrass/node-pcap)

Honest Networking also requires MongoDB so make sure you install that instructions found [here](https://docs.mongodb.com/v3.2/installation/)

Honest Networking also requires Nmap and the intructions on how to install can be found [here](https://nmap.org/book/inst-macosx.html)

## Automatic Install

There is a script called install.sh simply run it.
```
$ ./install.sh
```
Sometimes with Git executables get there permissions changed. If this is the case.
```
$ chmod + x install.sh
$ ./install.sh
```


## Manual Install Honest Networking

#### Step 1 Add Symlink for airport

```
$ sudo ln -s /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/local/bin/airport

```

#### Step 2 using gulp npm and bower 

we are going to now use npm to install all the node modules, bower to install all the frontend tools and gulp to kick off the server. 

```
$ npm install
```

There have been reported problems of bower not installing all the modules correctly if this a problem then use.

```
$ sudo bower install --allow-root
```
Otherwise just use 
```
$ bower install
``` 
Before we actually kick off the app we need to have mongo running.
```
$ mongod
```
Once all modules are installed run gulp and it wll kick off
```
$ gulp
```
### Known Bugs

1. Nmap does take a few minutes to run and complete so if devices don't load right away.

2. After you run the install script even though the browser gets kicked off you may need to do a page refresh to see the project.

