var PUBLIC_KEY = "BGWiTMTOKGACAU3eX4yX-Q_eReu2lWRfIsImXwEQoDieGC_zp_S_1y9LR0yGasALWH7N3DYLK5CPGlNUNuPRezc";
//var PUBLIC_KEY = "BL3LL4YR9MtXDSLDcp_0d_g5CLnErzM-2JZFs7nLMuygPecyCpM9Tw3s7N-IiDwQrwfR2WJWiSFeoeJ4QEwEoYw";

var DB_NAME = "test-db";
var TABLE_NAME = "test-table";
var DATA = [{origin: 'DOC', uname: 'u1doc', key: 'u1key'},
			{origin: 'DOC', uname: 'u2doc', key: 'u2key'},
			{origin: 'DOC', uname: 'u3doc', key: 'u3key'}
			];

Notification.requestPermission(function(status){
	console.log('Notification status: ', status);
});

document.getElementById('printPush').addEventListener('click', printPush, false);

document.getElementById('submitGCMSend').addEventListener('click', sendGCMPush, false);
document.getElementById('submitFCMSend').addEventListener('click', sendFCMPush, false);

//Subscribe Handlers

document.getElementById('subscribe').addEventListener('click', subscribeHandler, false);
function subscribeHandler() {
	console.log('subscribeHandler is called');
	
	subscribeUser("");
}

document.getElementById('subscribe-pkey').addEventListener('click', subscribePKeyHandler, false);
function subscribePKeyHandler() {
	console.log('subscribePKeyHandler is called');
	
	subscribeUser(PUBLIC_KEY);
}

document.getElementById('unsubscribe').addEventListener('click', unsubscribeHandler, false);
function unsubscribeHandler() {
	console.log('unsubscribeHandler is called');
	
	navigator.serviceWorker.ready.then(function(reg) {
		reg.pushManager.getSubscription().then(function(subscription) {
			subscription.unsubscribe().then(function(successful) {
				console.log('Unsubscribe successful');
			}).catch(function(e) {
				console.log('Unsubscribe unsuccessful', e);
			})
		})
	});
}

document.getElementById('forward').addEventListener('click', forwardHandler, false);
function forwardHandler() {
	console.log('forwardHandler is called');
	
	var additionalData = "This is an additional data.";
	
	navigator.serviceWorker.ready.then(function(reg) {
		reg.pushManager.getSubscription().then(function(subscription) {
			var before = performance.now();
			subscription.forward_endpoint_url(additionalData).then(function(successful) {
				var after = performance.now();
				console.log("Forwarding took: " + (after - before) + "ms.");
				console.log('Forward Endpoint URL successful');
			}).catch(function(e) {
				var after = performance.now();
				console.log("Forwarding took: " + (after - before) + "ms.");
				console.log('Forward Endpoint URL unsuccessful', e);
			})
		})
	});
}

//Document Context Handlers

document.getElementById('create').addEventListener('click', createHandler, false);
function createHandler() {
	console.log('createHandler is called');
	
	createDB(DB_NAME, TABLE_NAME, false);
}

document.getElementById('createPrivate').addEventListener('click', createPrivateHandler, false);
function createPrivateHandler() {
	console.log('createPrivateHandler is called');
	
	createDB(DB_NAME, TABLE_NAME, true);
}

document.getElementById('insert').addEventListener('click', insertHandler, false);
function insertHandler() {
	console.log('insertHandler is called');
	
	insert(DB_NAME, TABLE_NAME, DATA, false);
}

document.getElementById('insertPrivate').addEventListener('click', insertPrivateHandler, false);
function insertPrivateHandler() {
	console.log('insertPrivateHandler is called');
	
	insert(DB_NAME, TABLE_NAME, DATA, true);
}

document.getElementById('read').addEventListener('click', readHandler, false);
function readHandler() {
	console.log('readHandler is called');
	
	read(DB_NAME, TABLE_NAME, false);
}

document.getElementById('readPrivate').addEventListener('click', readPrivateHandler, false);
function readPrivateHandler() {
	console.log('readPrivateHandler is called');
	
	read(DB_NAME, TABLE_NAME, true);
}

// Service Worker Context Handlers

document.getElementById('SWcreate').addEventListener('click', SWcreateHandler, false);
function SWcreateHandler() {
	console.log('SWcreateHandler is called');
	
	send2sw("create");
}

document.getElementById('SWcreatePrivate').addEventListener('click', SWcreatePrivateHandler, false);
function SWcreatePrivateHandler() {
	console.log('SWcreatePrivateHandler is called');
	
	send2sw("createPrivate");
}

document.getElementById('SWinsert').addEventListener('click', SWinsertHandler, false);
function SWinsertHandler() {
	console.log('SWinsertHandler is called');
	
	send2sw("insert");
}

document.getElementById('SWinsertPrivate').addEventListener('click', SWinsertPrivateHandler, false);
function SWinsertPrivateHandler() {
	console.log('SWinsertPrivateHandler is called');
	
	send2sw("insertPrivate");
}

document.getElementById('SWread').addEventListener('click', SWreadHandler, false);
function SWreadHandler() {
	console.log('SWreadHandler is called');
	
	send2sw("read");
}

document.getElementById('SWreadPrivate').addEventListener('click', SWreadPrivateHandler, false);
function SWreadPrivateHandler() {
	console.log('SWreadPrivateHandler is called');
	
	send2sw("readPrivate");
}

//Helper functions

function send2sw(data) {
	navigator.serviceWorker.controller.postMessage(data);
}

function printPush() {
	console.log('Print handler is called');
	
	navigator.serviceWorker.ready.then(function(reg) {
		reg.pushManager.getSubscription().then(function(sub) {
			if(sub) {
				console.log('Subscription Object: ', sub.toJSON());
			} else {
				console.log('Cannot get subscription object');
			}
		}).catch(function(err) {
			console.log('Cannot access PushManager');
		});
	}).catch(function(err) {
		console.log('Service Worker not ready');
	});
}

function sendFCMPush() {
	console.log('FCM Send Push handler is called');
	
	fcmPush(document.getElementById('endpoint').value, document.getElementById('title').value, document.getElementById('body').value);
}

function sendGCMPush() {
	console.log('GCM Send Push handler is called');
	
	gcmPush(document.getElementById('endpoint').value, document.getElementById('title').value, document.getElementById('body').value);
}

function subscribeUser(pubkey){
	if('serviceWorker' in navigator && 'PushManager' in window) {
		console.log('Service Worker and PushManager supported');

		if(pubkey != "") {
			pubkey = urlB64ToUint8Array(pubkey);

			navigator.serviceWorker.ready.then(function(reg){
				var before = performance.now();
				reg.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: pubkey
				}).then(function(sub) {
					var after = performance.now();
					console.log("Subscription took: " + (after - before) + "ms.");
					console.log('Endpoint: ', sub.endpoint);
					console.log('p256dh: ', sub.getKey('p256dh'));
					console.log('auth: ', sub.getKey('auth'));
					console.log('JSON: ', sub.toJSON());
				}).catch(function(e) {
					var after = performance.now();
					console.log("Subscription took: " + (after - before) + "ms.");
					if(Notification.permission === 'denied') {
						console.warn('Permission for notification denied');
					} else {
						console.error('Unable to subscribe: ', e);
					}
				});
			});
		} else {
			navigator.serviceWorker.ready.then(function(reg){
				var before = performance.now();
				reg.pushManager.subscribe({
					userVisibleOnly: true
				}).then(function(sub) {
					var after = performance.now();
					console.log("Subscription took: " + (after - before) + "ms.");
					console.log('Endpoint: ', sub.endpoint);
					console.log('p256dh: ', sub.getKey('p256dh'));
					console.log('auth: ', sub.getKey('auth'));
					console.log('JSON: ', sub.toJSON());
				}).catch(function(e) {
					if(Notification.permission === 'denied') {
						console.warn('Permission for notification denied');
					} else {
						console.error('Unable to subscribe: ', e);
					}
				});
			});
		}
	} else {
		console.log('Service Worker or Push Notification not supported');
	}
}

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

