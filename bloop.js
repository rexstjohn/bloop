#!/usr/bin/env node

/**
* This is Bloop, a CLI tool for helping Mac / OSX developers work with Intel Edison more easily.
* Support for Linux and Windows pending on my future enthusiasm (and yours) to keep working on this.
*/

/**
* Define version, help info here
*/
var program = require('commander'),
	edisonCLI = require('./bloop-cli.js');

/**
* Define version, help info here
*/
program
    .version('0.0.1')
    .usage('[options] <keywords>');

/**
* Connect command, fast way to get a terminal using Edison.
* Offer user's the ability to clean out background screen sessions.
*/ 
program
  .command('connect')
  .option("-c, --clean", "Kill all existing screen sessions.")
  .description('Easy command to instantly give you the connection command to talk to Edison.')
  .action(function(options){
  	if(options.clean){
		console.log("Clearing all screen sessions.");
  		edisonCLI.cleanScreens(function(success){
			console.log("Cleaned screens!");
			edisonCLI.connect(function(result){
				console.log(result);
			}, function(error){
				console.log(error);
			});
  		}, function(error){
  			console.log(error)
  		});
  	} else {
  		edisonCLI.connect(function(result){
				console.log(result);
			}, function(error){
				console.log(error);
		});
  	}
  });

/**
* Print a list of attached Edison devices.
*/ 
program
  .command('list')
  .description('Easy way to view attached Edison devices.')
  .action(function(options){
  		edisonCLI.getUSBSerialDevices(function(result){
				console.log(result);
			}, function(error){
				console.log(error);
		});
  });

/**
* Clear all screen sessions. Screen can produce detached sessions which will
* block users from accessing Intel Edison via command line resulting in weird
* "Cant get a PTY" errors. This command helps avoid that.
*/ 
program
  .command('clean')
  .description('Clears all existing screen sessions and detached connections. Cleans all by default.')
  .option("-a, --attached", "Kill all attached screen sessions")
  .option("-d, --detached", "Kill all detached screen sessions")
  .action(function(options){
  		if(options.attached){
			edisonCLI.cleanAttachedScreens(function(result){
				console.log("Cleaned attached screens!");
			}, function(error){
				console.log(error);
			});
  		} else if(options.detached){
			edisonCLI.cleanDetachedScreens(function(result){
				console.log("Cleaned detached screens!");
			}, function(error){
				console.log(error);
			});
  		} else {
			edisonCLI.cleanScreens(function(result){
				console.log("Cleaned screens!");
			}, function(error){
				console.log(error);
			});
  		}
  });

/**
* Parse the args (e.g. --a etc)
*/
program.parse(process.argv);

/**
* Show help by default.
*/
if(!program.args.length){
	program.help();
} 


