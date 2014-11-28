/**
* Edison CLI to provide time-saving Bash calls via NPM
*/
var util = require('util'),
    exec = require('child_process').exec,
    child;

var EdisonCLI = function () {};

EdisonCLI.prototype = {
	/**
	* Automatically executes a connection with an attached Edison via USBSerial.
	* screen /dev/cu.usbserial-XXXXX 115200 -L
	*/
    connect: function(next){
		var me = this;
		this.getUSBSerialDevices(function handleUSB(err, result){
			if( err ){
				next( err );
			} else {
				me.executeScreenOnSerialDevice(result,next );
			}
		});
	},

	/**
	* Just tell me how to get a serial connection to my damn Edison!
	* Returns a connection string in the form of: 
	* screen /dev/cu.usbserial-XXXXX 115200 -L
	* Note: Does not execute this command!
	*/
	getConnectionString: function(next){
		var me = this;
		this.getUSBSerialDevices(function handleUSB(err, result){
			if( err ){
				next( err );
			} else {
				var commandStr = me.getUSBSerialCommand(result);
				next(null, commandStr);
			}
		});
	},

	/**
	* Fetches the list of USBSerial devices attached to this computer. This is used to specificy
	* an Edison board to connect to.
	*/
	getUSBSerialDevices: function(next) { 
	    child = exec('ls /dev/cu.usbserial-*',
		  function (error, stdout, stderr) { 
		  	stdout = stdout.replace(/\n$/, '');
		    if (error !== null || !stdout.length) {
			  next( new Error("No Edisons were found!") );
		    } else {
		   	  var cleaned = stdout;
		      next(null, cleaned);
		    }
		});
	},

	/**
	* Executes a screen command on a provided serial device e.g.
	* screen /dev/cu.usbserial-XXXXX 115200 -L
	*/ 
	executeScreenOnSerialDevice: function(serial_device, next){
		var me = this;
		console.log ("Initiating connection to: " + serial_device);
		console.log ("Note: If you get \'resource is busy\' or \'Couldn't find a PTY\',\nrun \'bloop clean\' to terminate stuck screen sessions and try again.\nMake sure BOTH Micro-USB are connected to your computer from Edison.");
		var spawn = require('child_process').spawn,
	    screencmd = spawn('screen', [serial_device,'115200','-L'], {stdio: 'inherit'});
		next(null, "Hope you enjoyed playing with Edison.");
	},

	/**
	* PBCopy an input to the clipboard
	*/ 
	copyInput: function(input, next) { 
		var command = 'echo \''+ input + '\'' + ' | pbcopy';
	    child = exec(command,
		  function (error, stdout, stderr) { 
		    if (error !== null) {
			  next( new Error("PBCopy has failed!") );
		    } else {
		      next(null, input);
		    }
		});
	},

	/**
	* All this does is produce the Bash command a user needs to connect to Edison. 
	* It's a simple time saver. 
	*/
	getUSBSerialCommand: function(edisonUSBSerialId) { 
		var commandStr = 'screen ' + edisonUSBSerialId + ' 115200 -L';
		return commandStr;
	},

	/**
	* Kills all detatched screen sessions in order to ensure we can connect.
	* The reason this exists is because often users forget that they have an active
	* terminal window open or detached screen process and it must be killed or
	* weird errors about PTY not found will occur. 
	*/
	cleanScreens: function(next){
		var commandStr = 'screen -ls | cut -d. -f1 | awk \'{print $1}\' | xargs kill';
		child = exec(commandStr,
		  function (error, stdout, stderr) {     
		    if (error !== null) {
		    	console.log(error);
			  next( new Error("No screens were cleaned!") );
		    } else {
		      next(null, stdout);
		    }
		});
	},

	/**
	* Destroy all attached screen sessions.
	*/
	cleanAttachedScreens: function(next){
		var commandStr = 'screen -ls | grep Attached | cut -d. -f1 | awk \'{print $1}\' | xargs kill';
		child = exec(commandStr,
		  function (error, stdout, stderr) {     
		    if (error !== null) {
			  next( new Error("No screens were cleaned!") );
		    } else {
		      next(null, stdout);
		    }
		});
	},

	/**
	* Destroy all detached screen sessions.
	*/
	cleanDetachedScreens: function(next){
		var commandStr = 'screen -ls | grep Detached | cut -d. -f1 | awk \'{print $1}\' | xargs kill';
		child = exec(commandStr,
		  function (error, stdout, stderr) {    
		  	stdout = stdout.replace(/\n$/, ''); 
		    if (error !== null || !stdout.length) {
			  next( new Error("No screens were cleaned!") );
		    } else {
		      next(null, stdout);
		    }
		});
	},

	/**
	* Returns a list of detached screen sessions.
	*/
	getDetachedScreens: function(next){
		var commandStr = 'screen -ls | grep Detached';
		child = exec(commandStr,
		  function (error, stdout, stderr) { 
		  	stdout = stdout.replace(/\n$/, '');    
		    if (error !== null || !stdout.length) {
			  next( new Error("No detached screens were found!") );
		    } else {
		      next(null, stdout);
		    }
		});
	},

	/**
	* Returns a list of attached screen sessions.
	*/
	getAttachedScreens: function(next){
		var commandStr = 'screen -ls | grep Attached';
		child = exec(commandStr,
		  function (error, stdout, stderr) {    
		  	stdout = stdout.replace(/\n$/, ''); 
		    if (error !== null || !stdout.length) {
			  next( new Error("No attached screens were found!") );
		    } else {
		      next(null, stdout);
		    }
		});
	},

	/**
	* Uses dns-sd to summon any local xdk-app-daemon which we think might be Intel Edison.
	*/
	scanLocalNetwork: function(next){
		// dns-sd -B _services._dns-sd._udp
		// dns-sd -B _xdk-app-daemon._tcp
		// dns-sd -L "rexison" _xdk-app-daemon._tcp
		// dns-sd -B _xdk-app-daemon._tcp | awk 'FNR == 5 {print $7}'
		// ssh rexison.local
		var me = this;
		var spawn = require('child_process').spawn,
	    dnssd = spawn('dns-sd', ['-B', '_xdk-app-daemon._tcp']);

	    // Killing of the process.
		dnssd.on('close', function (code, signal) {
		  // close.
		});

		// Handle data output.
		dnssd.stdout.on('data', function (data) {
		  me.parseDNSSDOutput(data, function handleDevices(err, result){
			  if ( err ) {
			    next(new Error("Something went very wrong."));
			  } else {
				next(null, result + '.local');
			  }
		  	  dnssd.kill('SIGHUP');
			});
		});

		// Handle stderr.
		dnssd.stderr.on('data', function (data) {
	      next(new Error("Something went very wrong."));
		  dnssd.kill('SIGHUP');
		});
	},

	/**
	* Parses dns-sd output into a useable result.
	*/
	parseDNSSDOutput: function(input, next){
		var commandStr = 'echo \'' + input + '\' | awk \'FNR == 5 {print $7}\'';
		child = exec(commandStr,
		  function (error, stdout, stderr) {     
		    if (error !== null) {
			  next( new Error("Failed to parse DNSSD output.") );
		    } else {
		      next(null, stdout.replace(/\n$/, ''));
		    }
		});
	}
};

module.exports = new EdisonCLI();