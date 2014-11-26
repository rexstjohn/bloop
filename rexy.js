#!/usr/bin/env node

var program = require('commander');
var edisonCLI = require('./rexy-cli.js');

/**
* Define version, help info here
*/
program
    .version('0.0.1')
    .usage('[options] <keywords>');

/**
* Connect command, fast way to get a terminal using Edison
*/ 
program
  .command('connect')
  .option("-c, --clean", "Kill all existing screen sessions")
  .description('connect to Edison via terminal using USB Serial cable')
  .action(function(options){

  	// Wipe out all existing screen sessions.
  	if(options.clean){
		console.log("Clearing all screen sessions.");
  		edisonCLI.cleanScreen(function(success){console.log(success)},
  			function(error){console.log(error)});
  	}

  	// Connect a new screen session.
	edisonCLI.connect(function(result){
		// success
		console.log(result);
	}, function(error){
		// failure
		console.log(error);
	});
  });

/**
* Clear all screen sessions
*/ 
program
  .command('clean')
  .description('clear all existing screen sessions')
  .action(function(){
		edisonCLI.cleanScreen(function(result){
			// success
			console.log("Cleaned");
		}, function(error){
			// failure
			console.log(error);
		});
  });

/**
* Parse the args (e.g. --a etc)
*/
program.parse(process.argv);

// Show help, otherwise do stuff with the incoming args
if(!program.args.length){
	program.help();
} else {
	//if(program.xyz){}
}


