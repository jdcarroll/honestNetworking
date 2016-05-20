[![Code Climate](https://codeclimate.com/github/jdcarroll/honestNetworking/badges/gpa.svg)](https://codeclimate.com/github/jdcarroll/honestNetworking)
# honestNetworking
### The complete automated network monitor for local network

#### Temporary Disclaimer

I am working on building a gulp file that will install the entire environment for you. This way you can just git clone or download the zip and then run gulp. However this is not finished at the moment so we have to do things manually right now.

### System Requirements

As of right now this application will only run on MAC OSX.  I am working on the linux build out but currently there a OS dependant features of this app that require the MAC OSX airport utility.

Honest Networking requires node version 5.1.1 or higher to successfull do packet anyalis as it relies on [Pcap2](https://github.com/andygreenegrass/node-pcap)

Honest Networking also requires MongoDB so make sure you install that instructions found [here](https://docs.mongodb.com/v3.2/installation/)

Honest Networking also requires Nmap and the intructions on how to install can be found [here](https://nmap.org/book/inst-macosx.html)

## Install Honest Networking

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
### known Bugs

1. Nmap does take a few minutes to run and complete so if devices don't load right away.

2. after you run the install script eventhough the browser kickoff you may need to do a page refresh to see the project.

