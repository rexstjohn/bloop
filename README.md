Rexy
===========

These are a suite of command line tools for Intel Edison using Node.js using commander.js. My goal is to make it instantly possible to configure everything about your Edison using simple command-line tools which you can download via the NPM package manager. At the moment I am writing this on OSX, happy to have help in expanding support to Windows and other OS's. 

Commands:

$ edison -a or edison --ahoy 

This command will automatically find your connected Edison and use screen /dev/cu.usbserial-XXXXX 115200 -L. I hate typing that out everyime I want to access my Edison.

$ edison wifi

Automagically share your current wi-fi settings with Edison.

$ edison goble

Automatically configure Intel Edison for BLE development. 

Installation:

$ npm install -g edison

Thanks, References:

This guide was most helpful: http://cruft.io/posts/node-command-line-utilities/. My utility uses Commander.js to do the footwork. So was this: http://bocoup.com/weblog/building-command-line-tools-in-node-with-liftoff/.

http://tjholowaychuk.tumblr.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made