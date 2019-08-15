var exports = module.exports = {};

var request = require('request');

exports.sendRequest = function(URL, params, callback){

	if(!URL.startsWith("http://")) URL = "http://"+URL;

	var opt = {
		headers: {'content-type' : 'application/x-www-form-urlencoded'},
		form: params,
		timeout: 60000
	};

	request.post(URL,opt,function (error, response, body) {
			if (!error && response.statusCode == 200) {
				callback(false,body);
			}
			else if(error) callback(error,null);
			else callback("Error: Response status "+response.statusCode,null);
		}
	);
}