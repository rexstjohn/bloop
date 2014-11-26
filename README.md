Bloop
===========

Bloop is a CLI tool for help developers work on Intel Edison. Bleep is the partner library which you can use on the Edison board itself. Bloop is specifically meant to help automate basic tasks revolving around connecting to Edison, getting a terminal, copying files to it and SSH-ing into it.

Commands:

$ bloop deploy (-n, --node)

Uses SCP to copy a node project to Edison's node_app_slot directory.

$ bloop select [edison]

Select an Edison device to use with connect, copy, ssh commands. 

$ bloop list (-w, --wifi, -u, --usb)

List all Intel Edison devices currently connected to your PC via USB Serial or available for connection on the local Wi-Fi network. Assigns a simple unique handle to each Edison.

$ bloop connect [edison] (-s, --ssh, -u, --usb)

Automatically generates a connect string you can use to talk to Edisons connected to your PC via USB Serial. Connects via ssh to Wi-Fi or via USB (or COM port). 

$ bloop clean

Wipes out all existing screen sessions and ensure Edison is ready to connect.

Installation:

$ npm install -g bloop

