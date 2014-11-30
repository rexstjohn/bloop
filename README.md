# Bloop
Bloop is a CLI tool for help developers work on Intel Edison. Bleep is the partner library which you can use on the Edison board itself. Bloop is specifically meant to help automate basic tasks revolving around connecting to Edison, getting a terminal, copying files to it and SSH-ing into it.

I have built bloop to function, by default, as though there were a single Edison on your local network. Most of the connection commands will scan for and connect to the first Edison found. In the event that you have multiple Edisons all on the same network, I have provided the ability to scan and connect with those Edisons generally via an -e flag.

*At this time, only Mac (Yosemite and similar) are supported*

[![npm version](https://badge.fury.io/js/bloop.svg)](http://badge.fury.io/js/bloop)

## Commands:

`$ bloop c`

*Automatically connects you via "screen" to an attached Edison device.*

*ex.: screen /dev/cu.usbserial-A402IDV3 115200 -L*

`$ bloop ssh [-u (specify a user other than root (default)), -e (specify an Edison into which to ssh, otherwise bloop picks the first one it finds)]`

*SSH's into your Edison via the local network by scanning for it using Bonjour and then initiating a connection command. Add a -u flag to specify a username other than root. Add -e to specify a specific Edison to ssh into, default behavior bloop picks the first one it finds (see bloop scan).*

*ex.: ssh root@youredison.local*

`$ bloop push [-u (specify a user other than root (default)), -d(specify a target directory), -e (specify an Edison into which to scp, otherwise bloop picks the first one it finds)]`

*Finds a local Edison and runs an "scp" (secure copy) command to deploy your current directory into Edison's ~/node_app_slot directory (default) using username "root." Add the -u option to specify a username other than "root."" Add -d to specify a target directory on the edison into which to deploy other than node_app_slot.*

*ex.: scp -r . root@youredison.local:/somedir*

`$ bloop list`

*List all Intel Edison devices currently connected to your PC via USB Serial.*

*ex.: /dev/cu.usbserial-A402IDV3*

`$ bloop clean [-a (all attached screen processes), -d (all detached screen processes)]`

*Wipes out all existing screen sessions and ensure Edison is ready to connect. Screen has a nasty tendency to leave detatched sessions behind which result in annoying and mysterious errors about "Can't find a PTY" or "Resource is busy." Just run bloop clean and you can kill all these detached sessions. You can manually specify attached or detached sessions only by adding the -a or -d options.*

`$ bloop scan [-r (show raw scan output)]`

*Scans locally available Bonjour services for the Intel XDK Daemon associated with an Intel Edison and reports on what it finds. If an Edison is found, you can ssh into the
Edison's name (edison_name.local) using the 'bloop ssh' command. Add the -r tag to display the raw scan results. By default this command is meant for single-Edison environments. In public areas with many Edisons you can discover them all using 'bloop scan -r'*

`$ bloop sniff [-c (copy results to clipboard)]`

*Sniff simply lists any Intel Edison connected to your computer and outputs a connection
string you can use to access it. Add -c to copy the results to your clipboard.*

*ex.: screen /dev/cu.usbserial-A402IDV3 115200 -L*

`$ bloop screens`

*List any existing screen sessions, attached or detatched.*

*ex.: Attached Screens: 	657.ttys002.Rex-St-John--Intel	(Attached)*

## Installation:

`$ npm install -g bloop`

