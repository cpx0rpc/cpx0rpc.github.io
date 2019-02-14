var SERVER_KEY = "AAAANvQZRCE:APA91bGW5zUrOQMNrrgoNGsHiKq2ZR9ElFtxopDI_T_FUPtAMB_4gB5wq8sRQxHc4tLTWHc926xvQXjnxg2BSvMeKr9cHj_1uNuo0xNvgwsrafR-U8YXIbATmkFxPgYsWxhynjG-uNzN_S3BxGXALM4B1FXqIr96BA";
var LEGACY_KEY = "AIzaSyCCepDZK4DVcpJmP3AtAoDzqqJnyXAcQFA";
var GCM_SERVER = "https://gcm-http.googleapis.com/gcm/send";
var FCM_SERVER = "https://fcm.googleapis.com/fcm/send";

function gcmPush(ENDPOINT, BODY, TITLE) {
	var data = `
	{
	  "data":{
		"message" : "` + BODY + `",
		"title" : "` + TITLE + `"
	   },
	   "to" : "` + ENDPOINT + `",
	}
	`

	var request = new XMLHttpRequest();
	request.open('POST', GCM_SERVER, true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.setRequestHeader('Authorization', 'key=' + SERVER_KEY);

	request.send(data);

	request.onreadystatechange = function () {
		if (request.readyState === 4) {
		   console.log(request.responseText);
		}
	};
}

function fcmPush(ENDPOINT, BODY, TITLE) {
	var data = `
	{
	  "data":{
		"message" : "` + BODY + `",
		"title" : "` + TITLE + `"
	   },
	   "to" : "` + ENDPOINT + `",
	}
	`

	var request = new XMLHttpRequest();
	request.open('POST', FCM_SERVER, true);
	request.setRequestHeader('Content-Type', 'application/json');
	request.setRequestHeader('Authorization', 'key=' + SERVER_KEY);

	request.send(data);

	request.onreadystatechange = function () {
		if (request.readyState === 4) {
		   console.log(request.responseText);
		}
	};
}