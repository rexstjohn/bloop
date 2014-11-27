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
*/ 
program
  .command('c')
  .option("-c, --copy", "Copy the input to your clipboard automatically")
  .description('Easy command to instantly give you the connection command to talk to Edison.')
  .action(function(options){
	edisonCLI.connect(function handleConnect(err, result){
	  if ( err ) {
	    console.log(err);
	  } else {
	  	if(options.copy){
	  		edisonCLI.copyInput(result, function handleCopy(err, result){
				if ( err ) {
				   console.log(err);
				} else {
					console.log(result);
					console.log("Copied to clipboard. Hit Command + v to paste the command.")
				}
	  		});
	  	}else{
			console.log("Generated command: " + result);
	  	}
	  }
	});
  });

/**
* Print a list of attached Edison devices.
*/ 
program
  .command('list')
  .description('Easy way to view attached Edison devices.')
  .action(function(options){
  		edisonCLI.getUSBSerialDevices(function handleDevices(err, result){
		  if ( err ) {
		    console.log(err);
		  } else {
			console.log(result);
		  }
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
			edisonCLI.cleanAttachedScreens(function handleClean(err, result){
			  if ( err ) {
			      console.log(err);
			  } else {
			      console.log('Cleaned attached screens!');
			  }
			});
  		} else if(options.detached){
  			edisonCLI.cleanDetachedScreens(function handleClean(err, result){
			  if ( err ) {
			      console.log(err);
			  } else {
			      console.log('Cleaned detached screens!');
			  }
			});
  		} else {
  			edisonCLI.cleanScreens(function handleClean(err, result){
			  if ( err ) {
			      console.log(err);
			  } else {
			      console.log('Cleaned screens!');
			  }
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


