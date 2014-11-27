/**
* Edison CLI to provide time-saving Bash calls via NPM
*/
var util = require('util'),
	mdns = require('mdns-js'),
    exec = require('child_process').exec,
    child;

var EdisonCLI = function () {};

EdisonCLI.prototype = {
	/**
	* Just tell me how to get a serial connection to my damn Edison!
	*/
    connect: function(next){
		var me = this;

		// Returns a command string like "screen /dev/usbserial-XXXX 115200 -L"
		// I hate having to type that out every time, this makes it automatic.
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
		    if (error !== null || !stdout.length) {
			  next( new Error("No Edisons were found!") );
		    } else {
		   	  var cleaned = stdout.replace(/\n$/, '')
		      next(null, cleaned);
		    }
		});
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
		    if (error !== null) {
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
		    if (error !== null) {
			  next( new Error("No screens were found!") );
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
		    if (error !== null) {
			  next( new Error("No screens were found!") );
		    } else {
		      next(null, stdout);
		    }
		});
	},

	/**
	*
	*/
	scanLocalNetwork: function(next){
		//require('libnmap').nmap('discover', function(err, report){
		  //if (err) throw err
		  //console.log(report)
		//});//ifconfig | grep broadcast | arp -a | grep :
		//nc 192.168.2.15 1-9999
		// http://apple.stackexchange.com/questions/65673/can-i-list-all-the-bonjour-enabled-services-that-are-running
		//dns-sd -B _services._dns-sd._udp
		//dns-sd -B _xdk-app-daemon._tcp
		//dns-sd -L "rexison" _xdk-app-daemon._tcp
		// dns-sd -B _xdk-app-daemon._tcp | cut   awk ' {print $7}'
		//ssh rexison.local
		var browser = mdns.createBrowser();

		browser.on('ready', function () {
		    browser.discover(); 
		});

		browser.on('update', function (data) {
		    console.log('data:', data);
		});
	}
};

module.exports = new EdisonCLI();