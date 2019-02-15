function createDB(dbname, tablename, pv) {
	var request;
	if(pv) {
		console.log("[SW] Calling privateOpen()");
		var before = performance.now();
		request = indexedDB.privateOpen(dbname);
	} else { 
		console.log("[SW] Calling open()");
		var before = performance.now();
		request = indexedDB.open(dbname);
	}

	request.onupgradeneeded = function() {
		var after = performance.now();
		console.log("[SW] Opening took: " + (after - before) + "ms.");
		var db = request.result;
		var objStore = db.createObjectStore(tablename, {keyPath: 'id', autoIncrement: true});
	};

	request.onsuccess = function(event) {
		var after = performance.now();
		console.log("[SW] Opening took: " + (after - before) + "ms.");
	};

	request.onerror = function(event) {
		var after = performance.now();
		console.log("[SW] Opening took: " + (after - before) + "ms.");
		console.log('Cannot Create: ', request.error);
	};
}

function insert(dbname, tablename, data, pv) {
	var request;
	if(pv) {
		console.log("[SW] Inserting Private DB:");
		request = indexedDB.privateOpen(dbname);
	} else { 
		console.log("[SW] Inserting Public DB:");
		request = indexedDB.open(dbname);
	}
	
	request.onupgradeneeded = function() {
		console.log('Database not exist');
		return;
	};

	request.onsuccess = function(event) {
		var db = event.target.result;
		var before = performance.now();
		var tx = db.transaction(tablename, "readwrite");
		var objStore = tx.objectStore(tablename, {keyPath: 'id', autoIncrement: true});

		data.forEach(function (i) {
			console.log('Inserting: ', i);
			objStore.put(i);
		});

		var after = performance.now();
		console.log("[SW] Insert took: " + (after - before) + "ms.");

		tx.onsuccess = function() {
			console.log('Insert successful');
		};
		tx.onerror = function(event) {
			console.log('Cannot insert: ', tx.error);
		};
	};

	request.onerror = function(event) {
		console.log('Cannot Open: ', request.error);
	};
}

function read(dbname, tablename, pv) {
	var request;
	if(pv) {
		console.log("[SW] Reading Private DB:");
		request = indexedDB.privateOpen(dbname);
	} else { 
		console.log("[SW] Reading Public DB:");
		request = indexedDB.open(dbname);
	} 
	
	request.onupgradeneeded = function() {
		console.log('Database not exist');
		return;
	};

	request.onsuccess = function(event) {
		var db = event.target.result;
		var before = performance.now();
		var tx = db.transaction(tablename, "readonly");
		var objStore = tx.objectStore(tablename);

		var get = objStore.getAll();

		var after = performance.now();
		console.log("[SW] Reading took: " + (after - before) + "ms.");

		get.onsuccess = function() {
			console.log(get.result);
		};		
		get.onerror = function(error) {
			console.log('Get Error: ', get.error);
		};
	};
}  
