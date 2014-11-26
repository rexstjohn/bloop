/**
* Edison CLI to provide time-saving Bash calls via NPM
*/
var util = require('util'),
	os = require('os'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    child;

var EdisonCLI = function () {};

EdisonCLI.prototype = {
	/**
	* Just tell me how to get a serial connection to my damn Edison!
	*/
    connect: function(callback, errorcbk){
		// OS (http://nodejs.org/api/os.html#os_os_platform)
		// linux, darwin, win32, sunos 
		var currentOS = os.platform;
		var me = this;

		// Returns a command string like "screen /dev/usbserial-XXXX 115200 -L"
		// I hate having to type that out every time, this makes it automatic.
		this.getUSBSerialDevice(function(result){
			var commandStr = me.getUSBSerialCommand(result);
			callback(commandStr);
		}, function(error){
			errorcbk(error);
		});
	},

	/**
	* Fetches the list of USBSerial devices attached to this computer. This is used to specificy
	* an Edison board to connect to.
	*/
	getUSBSerialDevice: function(callback, errorcbk) { 
	    child = exec('ls /dev/cu.usbserial-*',
		  function (error, stdout, stderr) { 
		    if (error !== null || !stdout.length) {
		      errorcbk(error + stdout);
		    } else {
		   	  var cleaned = stdout.replace(/\n$/, '')
		      callback(cleaned);
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
	cleanScreens: function(callback,errorcbk){
		var commandStr = 'screen -ls | cut -d. -f1 | awk \'{print $1}\' | xargs kill';
		child = exec(commandStr,
		  function (error, stdout, stderr) {     
		    if (error !== null) {
		      errorcbk(error + stdout);
		    } else {
		      callback(stdout);
		    }
		});
	},

	/**
	* Destroy all attached screen sessions.
	*/
	cleanAttachedScreens: function(callback,errorcbk){
		var commandStr = 'screen -ls | grep Attached | cut -d. -f1 | awk \'{print $1}\' | xargs kill';
		child = exec(commandStr,
		  function (error, stdout, stderr) {     
		    if (error !== null) {
		      errorcbk(error + stdout);
		    } else {
		      callback(stdout);
		    }
		});
	},

	/**
	* Destroy all detached screen sessions.
	*/
	cleanDetachedScreens: function(callback,errorcbk){
		var commandStr = 'screen -ls | grep Detached | cut -d. -f1 | awk \'{print $1}\' | xargs kill';
		child = exec(commandStr,
		  function (error, stdout, stderr) {     
		    if (error !== null) {
		      errorcbk(error + stdout);
		    } else {
		      callback(stdout);
		    }
		});
	},

	/**
	* Returns a list of detached screen sessions.
	*/
	getDetachedScreens: function(success, errorcbk){
		var commandStr = 'screen -ls | grep Detached';
		child = exec(commandStr,
		  function (error, stdout, stderr) {     
		    if (error !== null) {
		      errorcbk(error + stdout);
		    } else {
		      success(stdout);
		    }
		});
	},

	/**
	* Returns a list of attached screen sessions.
	*/
	getAttachedScreens: function(success, errorcbk){
		var commandStr = 'screen -ls | grep Attached';
		child = exec(commandStr,
		  function (error, stdout, stderr) {     
		    if (error !== null) {
		      errorcbk(error + stdout);
		    } else {
		      success(stdout);
		    }
		});
	}
};

module.exports = new EdisonCLI();