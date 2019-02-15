self.importScripts('idb-sw.js');

var DB_NAME = "test-db";
var TABLE_NAME = "test-table";
var DATA = [{origin: 'SW', uname: 'u1sw', key: 'u1swkey'},
			{origin: 'SW', uname: 'u2sw', key: 'u2swkey'},
			{origin: 'SW', uname: 'u3sw', key: 'u3swkey'}
			];

self.addEventListener('install', function() {
	console.log('[SW] Registered');
});

self.addEventListener('push', function(event) {
	console.log('[SW] Push received', event);
	
	const title = 'PWA Push Test';
	const options = {
		body: 'Message Body.'
	};
	event.waitUntil(self.registration.showNotification(title, options));
	
});

self.addEventListener('message', function(event) {
	console.log('[SW] Message: ', event.data);
	
	if(event.data === 'create') {
		createDB(DB_NAME, TABLE_NAME, false);
	}
	else if(event.data === 'createPrivate') {
		createDB(DB_NAME, TABLE_NAME, true);
	}
	else if(event.data === 'insert') {
		insert(DB_NAME, TABLE_NAME, DATA, false);
	}
	else if(event.data === 'insertPrivate') {
		insert(DB_NAME, TABLE_NAME, DATA, true);
	}
	else if(event.data === 'read') {
		read(DB_NAME, TABLE_NAME, false);
	}
	else if(event.data === 'readPrivate') {
		read(DB_NAME, TABLE_NAME, true);
	}
	else {
		console.log('[SW] Invalid command: ', event.data);
	}
});
