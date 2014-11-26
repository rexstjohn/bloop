/**
* Edison CLI to provide time-saving Bash calls via NPM
* 
*/
var util = require('util'),
	os = require('os'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    child;

var EdisonCLI = function () {};

/**
* Prototype wrapper
*/ 
EdisonCLI.prototype = {
	/**
	* This is meant to run on your computer which you are connecting to Edison, it calls
	* 'screen' (or Windows equivalent) to create a terminal access point. 
	*/
    connect: function(callback, errorcbk){
		// OS (http://nodejs.org/api/os.html#os_os_platform)
		// linux, darwin, win32, sunos 
		var currentOS = os.platform;
		var me = this;

		//
		this.getUSBSerialDevice(function(result){
			me.connectUSBSerial(result, callback, errorcbk);
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
	* Fetches the list of USBSerial devices attached to this computer. This is used to specificy
	* an Edison board to connect to.
	*/
	connectUSBSerial: function(edisonUSBSerialId, callback, errorcbk) { 
		console.log('Connecting to usbserial: ' + edisonUSBSerialId);
		var commandStr = 'screen ' + edisonUSBSerialId + ' 115200 -L';
		var child = exec(commandStr, function (error, stdout, stderr) {     
		    if (error !== null) {
		      errorcbk(error + stdout);
		    } else {
		      callback(stdout);
		    }
		});

		child.on('exit', function () {
		    console.log('Hope you had fun with Edison.');
		    callback("exited successfully.");
		});
	},

	/**
	* Kills all detatched screen sessions in order to ensure we can connect.
	*/
	cleanScreen: function(callback,errorcbk){

		var commandStr = 'screen -ls | grep Detached | cut -d. -f1 | awk \'{print $1}\' | xargs kill';
		// Do we want to do this?
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
	* Returns a list of detached screen sessions
	*/
	getDetachedScreens: function(success, errorcbk){
		var commandStr = 'screen -ls | grep Detached';
		// Do we want to do this?
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
	* Returns a list of attached screen sessions
	*/
	getAttachedScreens: function(success, errorcbk){
		var commandStr = 'screen -ls | grep Attached';
		// Do we want to do this?
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