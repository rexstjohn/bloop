Bloop
===========

Bloop is a CLI tool for help developers work on Intel Edison. Bleep is the partner library which you can use on the Edison board itself. Bloop is specifically meant to help automate basic tasks revolving around connecting to Edison, getting a terminal, copying files to it and SSH-ing into it.

Commands:

$ bloop list

List all Intel Edison devices currently connected to your PC via USB Serial.

$ bloop connect (-c, --clean)

Automatically generates a connect string you can use to talk to Edisons connected to your PC via USB Serial. Add "-c or --clean" to automatically clean all attached and detached screen sessions. 

$ bloop clean

Wipes out all existing screen sessions and ensure Edison is ready to connect.

Installation:

$ npm install -g bloop

