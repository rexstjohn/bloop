Bloop
===========

Bloop is a CLI tool for help developers work on Intel Edison. Bleep is the partner library which you can use on the Edison board itself. Bloop is specifically meant to help automate basic tasks revolving around connecting to Edison, getting a terminal, copying files to it and SSH-ing into it.

[![npm version](https://badge.fury.io/js/bloop.svg)](http://badge.fury.io/js/bloop)

Commands:

$ bloop list

List all Intel Edison devices currently connected to your PC via USB Serial.

$ bloop connect 

Automatically generates a connect string you can use to talk to Edisons connected to your PC via USB Serial. 

$ bloop clean

Wipes out all existing screen sessions and ensure Edison is ready to connect.

Installation:

$ npm install -g bloop

